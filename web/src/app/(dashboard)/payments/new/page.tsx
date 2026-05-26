import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Label, Input, Select } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { createPayment } from "@/app/actions/orders";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export default async function NewPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  const orders = await prisma.order.findMany({
    include: { customer: true },
    orderBy: { id: "desc" },
  });

  const selectedOrder = orderId
    ? orders.find((order) => order.id === Number(orderId))
    : undefined;

  return (
    <>
      <PageHeader
        title="Record payment"
        description="Link a payment to an order. Paid totals update order status automatically."
      />

      <form action={createPayment} className="max-w-xl space-y-4 rounded-xl border border-border bg-card p-6">
        <div className="space-y-2">
          <Label htmlFor="orderId">Order</Label>
          <Select
            id="orderId"
            name="orderId"
            required
            defaultValue={selectedOrder ? String(selectedOrder.id) : ""}
          >
            <option value="" disabled>
              Select order
            </option>
            {orders.map((order) => (
              <option key={order.id} value={order.id}>
                Order #{order.id} · {order.customer.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="method">Method</Label>
            <Select id="method" name="method" required defaultValue="CREDIT">
              <option value="CASH">Cash</option>
              <option value="DEBIT">Debit</option>
              <option value="CREDIT">Credit</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select id="status" name="status" required defaultValue="PENDING">
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            defaultValue={selectedOrder ? Number(selectedOrder.totalAmount) : undefined}
            required
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className={cn(buttonVariants())}>
            Save payment
          </button>
          <Link href="/payments" className={cn(buttonVariants({ variant: "outline" }))}>
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
