"use server";

import { apiJson } from "@/lib/api";
import { type FormState, runFormAction } from "@/lib/form-action";
import { orderItemSchema, orderSchema, paymentSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createOrder(formData: FormData) {
  const parsed = orderSchema.safeParse({
    customerId: formData.get("customerId"),
    employeeId: formData.get("employeeId"),
    orderDate: formData.get("orderDate"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid order data");
  }

  const order = await apiJson<{ id: number; error?: string }>("/orders", {
    method: "POST",
    body: JSON.stringify({
      customerId: parsed.data.customerId,
      employeeId: parsed.data.employeeId,
      orderDate: parsed.data.orderDate ?? undefined,
    }),
  });

  if ("error" in order && order.error) {
    throw new Error(order.error);
  }

  revalidatePath("/orders");
  redirect(`/orders/${order.id}`);
}

export async function deleteOrder(id: number) {
  const result = await apiJson<{ ok?: boolean; error?: string }>(`/orders/${id}`, {
    method: "DELETE",
  });
  if (result?.error) throw new Error(result.error);
  revalidatePath("/orders");
  redirect("/orders");
}

export async function addOrderItem(orderId: number, formData: FormData) {
  const parsed = orderItemSchema.safeParse({
    productId: formData.get("productId"),
    quantity: formData.get("quantity"),
    unitPrice: formData.get("unitPrice"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid line item");
  }

  const result = await apiJson<{ ok?: boolean; error?: string }>(
    `/orders/${orderId}/items`,
    {
      method: "POST",
      body: JSON.stringify(parsed.data),
    },
  );
  if (result?.error) throw new Error(result.error);

  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/orders");
}

export async function removeOrderItem(orderId: number, productId: number) {
  const result = await apiJson<{ ok?: boolean; error?: string }>(
    `/orders/${orderId}/items/${productId}`,
    { method: "DELETE" },
  );
  if (result?.error) throw new Error(result.error);

  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/orders");
}

export async function createPayment(formData: FormData) {
  const parsed = paymentSchema.safeParse({
    orderId: formData.get("orderId"),
    method: formData.get("method"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid payment data");
  }

  const payment = await apiJson<{ id: number; error?: string }>("/payments", {
    method: "POST",
    body: JSON.stringify(parsed.data),
  });
  if ("error" in payment && payment.error) throw new Error(payment.error);

  revalidatePath("/payments");
  revalidatePath(`/orders/${parsed.data.orderId}`);
  redirect(`/payments/${payment.id}`);
}

export async function updatePayment(id: number, formData: FormData) {
  const parsed = paymentSchema.safeParse({
    orderId: formData.get("orderId"),
    method: formData.get("method"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid payment data");
  }

  const payment = await apiJson<{ orderId: number; error?: string }>(
    `/payments/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(parsed.data),
    },
  );
  if ("error" in payment && payment.error) throw new Error(payment.error);

  revalidatePath("/payments");
  revalidatePath(`/payments/${id}`);
  revalidatePath(`/orders/${payment.orderId}`);
  redirect(`/payments/${id}`);
}

export async function deletePayment(id: number) {
  const payment = await apiJson<{ ok?: boolean; error?: string }>(
    `/payments/${id}`,
    { method: "DELETE" },
  );
  if (payment?.error) throw new Error(payment.error);

  revalidatePath("/payments");
  // Can't easily revalidate the order without the orderId; revalidate orders list instead
  revalidatePath(`/orders`);
  redirect("/payments");
}

export async function createOrderFormAction(
  _prev: FormState,
  formData: FormData,
) {
  return runFormAction(() => createOrder(formData));
}

export async function deleteOrderFormAction(
  id: number,
  _prev: FormState,
  _formData: FormData,
) {
  return runFormAction(() => deleteOrder(id));
}

export async function addOrderItemFormAction(
  orderId: number,
  _prev: FormState,
  formData: FormData,
) {
  return runFormAction(() => addOrderItem(orderId, formData));
}

export async function removeOrderItemFormAction(
  orderId: number,
  productId: number,
  _prev: FormState,
  _formData: FormData,
) {
  return runFormAction(() => removeOrderItem(orderId, productId));
}

export async function createPaymentFormAction(
  _prev: FormState,
  formData: FormData,
) {
  return runFormAction(() => createPayment(formData));
}

export async function updatePaymentFormAction(
  id: number,
  _prev: FormState,
  formData: FormData,
) {
  return runFormAction(() => updatePayment(id, formData));
}

export async function deletePaymentFormAction(
  id: number,
  _prev: FormState,
  _formData: FormData,
) {
  return runFormAction(() => deletePayment(id));
}
