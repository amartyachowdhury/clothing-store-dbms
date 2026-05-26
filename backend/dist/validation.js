"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentSchema = exports.orderItemSchema = exports.orderCreateSchema = exports.productInputSchema = exports.customerInputSchema = void 0;
const zod_1 = require("zod");
exports.customerInputSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1).max(128),
    email: zod_1.z.string().trim().email().max(128).optional().or(zod_1.z.literal("")),
    phone: zod_1.z.string().trim().min(1).max(64),
});
exports.productInputSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1).max(128),
    size: zod_1.z.string().trim().min(1).max(64),
    colour: zod_1.z.string().trim().min(1).max(64),
    brand: zod_1.z.string().trim().min(1).max(128),
    price: zod_1.z.coerce.number().positive(),
    stockQty: zod_1.z.coerce.number().int().min(0),
    categoryId: zod_1.z.coerce.number().int().positive(),
});
exports.orderCreateSchema = zod_1.z.object({
    customerId: zod_1.z.coerce.number().int().positive(),
    employeeId: zod_1.z.coerce.number().int().positive(),
    orderDate: zod_1.z.string().optional(),
});
exports.orderItemSchema = zod_1.z.object({
    productId: zod_1.z.coerce.number().int().positive(),
    quantity: zod_1.z.coerce.number().int().positive(),
    unitPrice: zod_1.z.coerce.number().positive(),
});
exports.paymentSchema = zod_1.z.object({
    orderId: zod_1.z.coerce.number().int().positive(),
    method: zod_1.z.enum(["CASH", "DEBIT", "CREDIT"]),
    amount: zod_1.z.coerce.number().positive(),
    status: zod_1.z.enum(["PENDING", "PAID"]).default("PENDING"),
});
