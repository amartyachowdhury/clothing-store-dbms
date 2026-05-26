import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus, Prisma } from "@/generated/prisma/client";

type DbClient = Prisma.TransactionClient;

export async function recalculateOrderTotal(orderId: number, db: DbClient = prisma) {
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

export async function syncOrderStatusFromPayments(
  orderId: number,
  db: DbClient = prisma,
) {
  const [order, payments] = await Promise.all([
    db.order.findUnique({ where: { id: orderId } }),
    db.payment.findMany({ where: { orderId } }),
  ]);

  if (!order) {
    return;
  }

  if (payments.length === 0) {
    await db.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.PENDING },
    });
    return;
  }

  const paidTotal = payments
    .filter((payment) => payment.status === PaymentStatus.PAID)
    .reduce((sum, payment) => sum + Number(payment.amount), 0);

  const orderTotal = Number(order.totalAmount);
  const nextStatus =
    orderTotal > 0 && paidTotal >= orderTotal
      ? OrderStatus.COMPLETED
      : OrderStatus.PENDING;

  await db.order.update({
    where: { id: orderId },
    data: { status: nextStatus },
  });
}

export async function getOrderWithDetails(orderId: number, db: DbClient = prisma) {
  return db.order.findUnique({
    where: { id: orderId },
    include: {
      customer: true,
      employee: true,
      items: { include: { product: true } },
      payments: true,
    },
  });
}
