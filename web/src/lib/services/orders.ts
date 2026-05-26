import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus } from "@/generated/prisma/client";

export async function recalculateOrderTotal(orderId: number) {
  const items = await prisma.orderItem.findMany({ where: { orderId } });

  const total = items.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0,
  );

  await prisma.order.update({
    where: { id: orderId },
    data: { totalAmount: total > 0 ? total : 0 },
  });

  return total;
}

export async function syncOrderStatusFromPayments(orderId: number) {
  const [order, payments] = await Promise.all([
    prisma.order.findUnique({ where: { id: orderId } }),
    prisma.payment.findMany({ where: { orderId } }),
  ]);

  if (!order) {
    return;
  }

  if (payments.length === 0) {
    await prisma.order.update({
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

  await prisma.order.update({
    where: { id: orderId },
    data: { status: nextStatus },
  });
}

export async function getOrderWithDetails(orderId: number) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      customer: true,
      employee: true,
      items: { include: { product: true } },
      payments: true,
    },
  });
}
