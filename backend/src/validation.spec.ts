import { describe, expect, it } from "vitest";
import {
  customerInputSchema,
  orderCreateSchema,
  paymentSchema,
  productInputSchema,
} from "./validation";

describe("customerInputSchema", () => {
  it("accepts valid input", () => {
    const result = customerInputSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "555-0100",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = customerInputSchema.safeParse({
      name: "",
      phone: "555-0100",
    });
    expect(result.success).toBe(false);
  });
});

describe("productInputSchema", () => {
  it("coerces numeric fields", () => {
    const result = productInputSchema.safeParse({
      name: "Shirt",
      size: "M",
      colour: "Blue",
      brand: "Acme",
      price: "29.99",
      stockQty: "10",
      categoryId: "1",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price).toBe(29.99);
      expect(result.data.stockQty).toBe(10);
      expect(result.data.categoryId).toBe(1);
    }
  });
});

describe("orderCreateSchema", () => {
  it("requires positive customer and employee ids", () => {
    expect(
      orderCreateSchema.safeParse({ customerId: 0, employeeId: 1 }).success,
    ).toBe(false);
  });
});

describe("paymentSchema", () => {
  it("defaults status to PENDING", () => {
    const result = paymentSchema.safeParse({
      orderId: 1,
      method: "CASH",
      amount: 50,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("PENDING");
    }
  });
});
