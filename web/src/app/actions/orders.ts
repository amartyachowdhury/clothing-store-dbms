"use server";

import { prisma } from "@/lib/prisma";
import {
  recalculateOrderTotal,
  syncOrderStatusFromPayments,
} from "@/lib/services/orders";
import { orderItemSchema, orderSchema, paymentSchema } from "@/lib/validations";
import { OrderStatus } from "@/generated/prisma/client";
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

  const order = await prisma.order.create({
    data: {
      customerId: parsed.data.customerId,
      employeeId: parsed.data.employeeId,
      orderDate: parsed.data.orderDate
        ? new Date(parsed.data.orderDate)
        : new Date(),
      totalAmount: 0,
      status: OrderStatus.PENDING,
    },
  });

  revalidatePath("/orders");
  redirect(`/orders/${order.id}`);
}

export async function deleteOrder(id: number) {
  await prisma.order.delete({ where: { id } });
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

  await prisma.orderItem.upsert({
    where: {
      orderId_productId: {
        orderId,
        productId: parsed.data.productId,
      },
    },
    update: {
      quantity: parsed.data.quantity,
      unitPrice: parsed.data.unitPrice,
    },
    create: {
      orderId,
      productId: parsed.data.productId,
      quantity: parsed.data.quantity,
      unitPrice: parsed.data.unitPrice,
    },
  });

  await recalculateOrderTotal(orderId);
  await syncOrderStatusFromPayments(orderId);

  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/orders");
}

export async function removeOrderItem(orderId: number, productId: number) {
  await prisma.orderItem.delete({
    where: {
      orderId_productId: { orderId, productId },
    },
  });

  await recalculateOrderTotal(orderId);
  await syncOrderStatusFromPayments(orderId);

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

  const payment = await prisma.payment.create({
    data: parsed.data,
  });

  await syncOrderStatusFromPayments(parsed.data.orderId);

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

  const payment = await prisma.payment.update({
    where: { id },
    data: parsed.data,
  });

  await syncOrderStatusFromPayments(parsed.data.orderId);

  revalidatePath("/payments");
  revalidatePath(`/payments/${id}`);
  revalidatePath(`/orders/${payment.orderId}`);
  redirect(`/payments/${id}`);
}

export async function deletePayment(id: number) {
  const payment = await prisma.payment.delete({ where: { id } });
  await syncOrderStatusFromPayments(payment.orderId);

  revalidatePath("/payments");
  revalidatePath(`/orders/${payment.orderId}`);
  redirect("/payments");
}
