import { Injectable } from "@nestjs/common";
import { OrderStatus, PaymentStatus, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

type DbClient = Prisma.TransactionClient;

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async recalculateOrderTotal(orderId: number, db: DbClient) {
    const items = await db.orderItem.findMany({ where: { orderId } });
    const total = items.reduce(
      (sum, item) => sum + Number(item.unitPrice) * item.quantity,
      0,
    );
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

    if (payments.length === 0) {
      await db.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.PENDING },
      });
      return;
    }

    const paidTotal = payments
      .filter((p) => p.status === PaymentStatus.PAID)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const orderTotal = Number(order.totalAmount);
    const nextStatus =
      orderTotal > 0 && paidTotal >= orderTotal
        ? OrderStatus.COMPLETED
        : OrderStatus.PENDING;

    await db.order.update({ where: { id: orderId }, data: { status: nextStatus } });
  }

  async withTransaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>) {
    return this.prisma.$transaction(fn);
  }
}

