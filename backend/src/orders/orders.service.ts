import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { calculateItemsTotal, deriveOrderStatus } from "./orders.logic";

type DbClient = Prisma.TransactionClient;

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async recalculateOrderTotal(orderId: number, db: DbClient) {
    const items = await db.orderItem.findMany({ where: { orderId } });
    const total = calculateItemsTotal(items);
    await db.order.update({
      where: { id: orderId },
      data: { totalAmount: total > 0 ? total : 0 },
    });
    return total;
  }

  async syncOrderStatusFromPayments(orderId: number, db: DbClient) {
    const [order, payments] = await Promise.all([
      db.order.findUnique({ where: { id: orderId } }),
      db.payment.findMany({ where: { orderId } }),
    ]);

    if (!order) return;

    const nextStatus = deriveOrderStatus(
      Number(order.totalAmount),
      payments,
    );

    await db.order.update({ where: { id: orderId }, data: { status: nextStatus } });
  }

  async withTransaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>) {
    return this.prisma.$transaction(fn);
  }
}

