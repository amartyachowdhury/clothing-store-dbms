import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { productInputSchema } from "../validation";

@Controller("products")
export class ProductsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list(@Query("q") q?: string) {
    const query = q?.trim();
    return this.prisma.product.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { brand: { contains: query, mode: "insensitive" } },
              { colour: { contains: query, mode: "insensitive" } },
            ],
          }
        : undefined,
      include: { category: true },
      orderBy: { name: "asc" },
    });
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    const productId = Number(id);
    return this.prisma.product.findUnique({
      where: { id: productId },
      include: { category: true },
    });
  }

  @Post()
  async create(@Body() body: unknown) {
    const parsed = productInputSchema.safeParse(body);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid product" };
    }
    return this.prisma.product.create({ data: parsed.data });
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() body: unknown) {
    const productId = Number(id);
    const parsed = productInputSchema.safeParse(body);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid product" };
    }
    return this.prisma.product.update({
      where: { id: productId },
      data: parsed.data,
    });
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    const productId = Number(id);
    await this.prisma.product.delete({ where: { id: productId } });
    return { ok: true };
  }
}

