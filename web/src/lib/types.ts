export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID";

export type OrderWithDetails = {
  id: number;
  orderDate: string;
  totalAmount: string | number;
  status: OrderStatus;
  customer: { id: number; name: string; phone: string; email: string | null };
  employee: { id: number; name: string; role: string };
  items: Array<{
    orderId: number;
    productId: number;
    quantity: number;
    unitPrice: string | number;
    product: { id: number; name: string };
  }>;
  payments: Array<{
    id: number;
    orderId: number;
    method: string;
    status: PaymentStatus;
    amount: string | number;
  }>;
};
