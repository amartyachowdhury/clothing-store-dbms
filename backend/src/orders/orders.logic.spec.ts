import { OrderStatus, PaymentStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { calculateItemsTotal, deriveOrderStatus } from "./orders.logic";

describe("calculateItemsTotal", () => {
  it("sums line items", () => {
    expect(
      calculateItemsTotal([
        { unitPrice: 10, quantity: 2 },
        { unitPrice: "5.5", quantity: 1 },
      ]),
    ).toBe(25.5);
  });

  it("returns 0 for empty orders", () => {
    expect(calculateItemsTotal([])).toBe(0);
  });
});

describe("deriveOrderStatus", () => {
  it("is PENDING with no payments", () => {
    expect(deriveOrderStatus(100, [])).toBe(OrderStatus.PENDING);
  });

  it("is PENDING when paid total is below order total", () => {
    expect(
      deriveOrderStatus(100, [
        { status: PaymentStatus.PAID, amount: 40 },
        { status: PaymentStatus.PENDING, amount: 60 },
      ]),
    ).toBe(OrderStatus.PENDING);
  });

  it("is COMPLETED when paid total meets or exceeds order total", () => {
    expect(
      deriveOrderStatus(100, [
        { status: PaymentStatus.PAID, amount: 60 },
        { status: PaymentStatus.PAID, amount: 40 },
      ]),
    ).toBe(OrderStatus.COMPLETED);
  });

  it("is PENDING when order total is zero", () => {
    expect(
      deriveOrderStatus(0, [{ status: PaymentStatus.PAID, amount: 50 }]),
    ).toBe(OrderStatus.PENDING);
  });
});
