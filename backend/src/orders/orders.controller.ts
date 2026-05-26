import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { orderCreateSchema, orderItemSchema, paymentSchema } from "../validation";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orders: OrdersService,
  ) {}

  @Get()
  async list(@Query("q") q?: string) {
    const query = q?.trim();
    return this.prisma.order.findMany({
      where: query
        ? {
            OR: [
              // status query
              { status: { equals: query.toUpperCase() as any } },
              { customer: { name: { contains: query, mode: "insensitive" } } },
              { employee: { name: { contains: query, mode: "insensitive" } } },
            ],
          }
        : undefined,
      include: { customer: true, employee: true },
      orderBy: { orderDate: "desc" },
    });
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    const orderId = Number(id);
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        employee: true,
        items: { include: { product: true } },
        payments: true,
      },
    });
  }

  @Post()
  async create(@Body() body: unknown) {
    const parsed = orderCreateSchema.safeParse(body);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid order" };
    }
    const order = await this.prisma.order.create({
      data: {
        customerId: parsed.data.customerId,
        employeeId: parsed.data.employeeId,
        orderDate: parsed.data.orderDate ? new Date(parsed.data.orderDate) : new Date(),
        totalAmount: 0,
        status: "PENDING",
      },
    });
    return order;
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    const orderId = Number(id);
    await this.prisma.order.delete({ where: { id: orderId } });
    return { ok: true };
  }

  @Post(":id/items")
  async upsertItem(@Param("id") id: string, @Body() body: unknown) {
    const orderId = Number(id);
    const parsed = orderItemSchema.safeParse(body);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid line item" };
    }

    await this.orders.withTransaction(async (tx) => {
      await tx.orderItem.upsert({
        where: {
          orderId_productId: {
            orderId,
            productId: parsed.data.productId,
          },
        },
        update: {
          quantity: parsed.data.quantity,
          unitPrice: parsed.data.unitPrice,
        },
        create: {
          orderId,
          productId: parsed.data.productId,
          quantity: parsed.data.quantity,
          unitPrice: parsed.data.unitPrice,
        },
      });

      await this.orders.recalculateOrderTotal(orderId, tx);
      await this.orders.syncOrderStatusFromPayments(orderId, tx);
    });

    return { ok: true };
  }

  @Delete(":id/items/:productId")
  async removeItem(
    @Param("id") id: string,
    @Param("productId") productId: string,
  ) {
    const orderId = Number(id);
    const pid = Number(productId);

    await this.orders.withTransaction(async (tx) => {
      await tx.orderItem.delete({
        where: { orderId_productId: { orderId, productId: pid } },
      });
      await this.orders.recalculateOrderTotal(orderId, tx);
      await this.orders.syncOrderStatusFromPayments(orderId, tx);
    });

    return { ok: true };
  }

  @Post(":id/payments")
  async createPayment(@Param("id") id: string, @Body() body: unknown) {
    const orderId = Number(id);
    const parsed = paymentSchema.safeParse({ ...(body as any), orderId });
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid payment" };
    }

    const payment = await this.orders.withTransaction(async (tx) => {
      const created = await tx.payment.create({ data: parsed.data });
      await this.orders.syncOrderStatusFromPayments(orderId, tx);
      return created;
    });

    return payment;
  }
}

