import { apiJson } from "@/lib/api";
import type { OrderWithDetails } from "@/lib/types";

export async function getOrderWithDetails(orderId: number) {
  return apiJson<OrderWithDetails | null>(`/orders/${orderId}`);
}
