import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiJson } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export default async function PaymentsPage() {
  const payments = await apiJson<
    Array<{
      id: number;
      orderId: number;
      method: string;
      status: "PENDING" | "PAID";
      amount: string | number;
      order: { customer: { name: string } };
    }>
  >("/payments");

  return (
    <>
      <PageHeader
        title="Payments"
        description="Track payment methods, amounts, and settlement status."
        actionHref="/payments/new"
        actionLabel="Record payment"
      />

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-muted-foreground">
                  No payments found.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">#{payment.id}</TableCell>
                  <TableCell>
                    <Link href={`/orders/${payment.orderId}`} className="hover:underline">
                      Order #{payment.orderId}
                    </Link>
                  </TableCell>
                  <TableCell>{payment.order.customer.name}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>
                    <Badge variant={payment.status === "PAID" ? "success" : "warning"}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(Number(payment.amount))}</TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/payments/${payment.id}`}
                      className="text-sm font-medium hover:underline"
                    >
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
