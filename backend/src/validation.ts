import { z } from "zod";

export const customerInputSchema = z.object({
  name: z.string().trim().min(1).max(128),
  email: z.string().trim().email().max(128).optional().or(z.literal("")),
  phone: z.string().trim().min(1).max(64),
});

export const productInputSchema = z.object({
  name: z.string().trim().min(1).max(128),
  size: z.string().trim().min(1).max(64),
  colour: z.string().trim().min(1).max(64),
  brand: z.string().trim().min(1).max(128),
  price: z.coerce.number().positive(),
  stockQty: z.coerce.number().int().min(0),
  categoryId: z.coerce.number().int().positive(),
});

export const orderCreateSchema = z.object({
  customerId: z.coerce.number().int().positive(),
  employeeId: z.coerce.number().int().positive(),
  orderDate: z.string().optional(),
});

export const orderItemSchema = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive(),
  unitPrice: z.coerce.number().positive(),
});

export const paymentSchema = z.object({
  orderId: z.coerce.number().int().positive(),
  method: z.enum(["CASH", "DEBIT", "CREDIT"]),
  amount: z.coerce.number().positive(),
  status: z.enum(["PENDING", "PAID"]).default("PENDING"),
});

