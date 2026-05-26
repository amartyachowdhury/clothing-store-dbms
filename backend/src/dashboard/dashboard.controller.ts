import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Controller("dashboard")
export class DashboardController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("stats")
  async stats() {
    const [customerCount, productCount, orderCount, paymentCount] =
      await Promise.all([
        this.prisma.customer.count(),
        this.prisma.product.count(),
        this.prisma.order.count(),
        this.prisma.payment.count(),
      ]);

    return { customerCount, productCount, orderCount, paymentCount };
  }

  @Get("revenue")
  async revenue() {
    const revenue = await this.prisma.payment.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    });
    return { total: Number(revenue._sum.amount ?? 0) };
  }

  @Get("recent-orders")
  async recentOrders() {
    return this.prisma.order.findMany({
      take: 5,
      orderBy: { orderDate: "desc" },
      include: { customer: true },
    });
  }

  @Get("low-stock")
  async lowStock() {
    return this.prisma.product.findMany({
      where: { stockQty: { lte: 10 } },
      orderBy: { stockQty: "asc" },
      take: 5,
    });
  }
}

