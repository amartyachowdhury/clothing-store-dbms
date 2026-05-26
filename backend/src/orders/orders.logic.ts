import { OrderStatus, PaymentStatus } from "@prisma/client";

/** Prisma `Decimal` and plain numbers coerce via `Number()`. */
export type OrderLineItem = {
  unitPrice: unknown;
  quantity: number;
};

export type OrderPayment = {
  status: PaymentStatus;
  amount: unknown;
};

export function calculateItemsTotal(items: OrderLineItem[]): number {
  return items.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0,
  );
}

/** Order status from payment rows and current order total (no DB). */
export function deriveOrderStatus(
  orderTotal: number,
  payments: OrderPayment[],
): OrderStatus {
  if (payments.length === 0) {
    return OrderStatus.PENDING;
  }

  const paidTotal = payments
    .filter((p) => p.status === PaymentStatus.PAID)
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return orderTotal > 0 && paidTotal >= orderTotal
    ? OrderStatus.COMPLETED
    : OrderStatus.PENDING;
}
