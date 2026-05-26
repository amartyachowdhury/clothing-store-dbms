import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { customerInputSchema } from "../validation";

@Controller("customers")
export class CustomersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list(@Query("q") q?: string) {
    const query = q?.trim();
    return this.prisma.customer.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
              { phone: { contains: query, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { name: "asc" },
    });
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    const customerId = Number(id);
    return this.prisma.customer.findUnique({
      where: { id: customerId },
      include: { orders: { orderBy: { orderDate: "desc" } } },
    });
  }

  @Post()
  async create(@Body() body: unknown) {
    const parsed = customerInputSchema.safeParse(body);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid customer" };
    }
    const created = await this.prisma.customer.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email || null,
        phone: parsed.data.phone,
      },
    });
    return created;
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() body: unknown) {
    const customerId = Number(id);
    const parsed = customerInputSchema.safeParse(body);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid customer" };
    }
    return this.prisma.customer.update({
      where: { id: customerId },
      data: {
        name: parsed.data.name,
        email: parsed.data.email || null,
        phone: parsed.data.phone,
      },
    });
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    const customerId = Number(id);
    await this.prisma.customer.delete({ where: { id: customerId } });
    return { ok: true };
  }
}

