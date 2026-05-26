import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { paymentSchema } from "../validation";
import { OrdersService } from "../orders/orders.service";

@Controller("payments")
export class PaymentsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orders: OrdersService,
  ) {}

  @Get()
  async list() {
    return this.prisma.payment.findMany({
      include: { order: { include: { customer: true } } },
      orderBy: { id: "desc" },
    });
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    const paymentId = Number(id);
    return this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: { include: { customer: true } } },
    });
  }

  @Post()
  async create(@Body() body: unknown) {
    const parsed = paymentSchema.safeParse(body);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid payment" };
    }

    return this.orders.withTransaction(async (tx) => {
      const created = await tx.payment.create({ data: parsed.data });
      await this.orders.syncOrderStatusFromPayments(parsed.data.orderId, tx);
      return created;
    });
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() body: unknown) {
    const paymentId = Number(id);
    const parsed = paymentSchema.safeParse(body);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid payment" };
    }

    return this.orders.withTransaction(async (tx) => {
      const updated = await tx.payment.update({
        where: { id: paymentId },
        data: parsed.data,
      });
      await this.orders.syncOrderStatusFromPayments(parsed.data.orderId, tx);
      return updated;
    });
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    const paymentId = Number(id);
    await this.orders.withTransaction(async (tx) => {
      const deleted = await tx.payment.delete({ where: { id: paymentId } });
      await this.orders.syncOrderStatusFromPayments(deleted.orderId, tx);
    });
    return { ok: true };
  }
}

