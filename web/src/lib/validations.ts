import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(128),
  email: z
    .string()
    .trim()
    .email("Invalid email")
    .max(128)
    .optional()
    .or(z.literal("")),
  phone: z.string().trim().min(1, "Phone is required").max(64),
});

export const productSchema = z.object({
  name: z.string().trim().min(1).max(128),
  size: z.string().trim().min(1).max(64),
  colour: z.string().trim().min(1).max(64),
  brand: z.string().trim().min(1).max(128),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stockQty: z.coerce.number().int().min(0, "Stock cannot be negative"),
  categoryId: z.coerce.number().int().positive(),
});

export const employeeSchema = z.object({
  name: z.string().trim().min(1).max(128),
  email: z.string().trim().email().max(128),
  phone: z.string().trim().min(1).max(64),
  role: z.string().trim().min(1).max(64),
});

export const orderSchema = z.object({
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

export type CustomerInput = z.infer<typeof customerSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type EmployeeInput = z.infer<typeof employeeSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
