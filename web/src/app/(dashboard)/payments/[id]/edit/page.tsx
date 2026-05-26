import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Label, Input, Select } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { updatePaymentFormAction } from "@/app/actions/orders";
import { ActionForm } from "@/components/action-form";
import { SubmitButton } from "@/components/submit-button";
import { apiJson } from "@/lib/api";
import { cn } from "@/lib/utils";

export default async function EditPaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [payment, orders] = await Promise.all([
    apiJson<
      | {
          id: number;
          orderId: number;
          method: string;
          status: "PENDING" | "PAID";
          amount: string | number;
        }
      | null
    >(`/payments/${Number(id)}`),
    apiJson<Array<{ id: number; customer: { name: string } }>>("/orders"),
  ]);

  if (!payment) {
    notFound();
  }

  const updateAction = updatePaymentFormAction.bind(null, payment.id);

  return (
    <>
      <PageHeader title="Edit payment" description={`Update payment #${payment.id}.`} />

      <ActionForm action={updateAction} className="max-w-xl space-y-4 rounded-xl border border-border bg-card p-6">
        <div className="space-y-2">
          <Label htmlFor="orderId">Order</Label>
          <Select
            id="orderId"
            name="orderId"
            defaultValue={String(payment.orderId)}
            required
          >
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
            <Select id="method" name="method" defaultValue={payment.method} required>
              <option value="CASH">Cash</option>
              <option value="DEBIT">Debit</option>
              <option value="CREDIT">Credit</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select id="status" name="status" defaultValue={payment.status} required>
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
            defaultValue={Number(payment.amount)}
            required
          />
        </div>
        <div className="flex gap-3 pt-2">
          <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
          <Link
            href={`/payments/${payment.id}`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Cancel
          </Link>
        </div>
      </ActionForm>
    </>
  );
}
