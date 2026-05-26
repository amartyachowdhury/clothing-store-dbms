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
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const orders = await apiJson<
    Array<{
      id: number;
      orderDate: string;
      totalAmount: string | number;
      status: "PENDING" | "COMPLETED" | "CANCELLED";
      customer: { name: string };
      employee: { name: string };
    }>
  >(`/orders${q ? `?q=${encodeURIComponent(q)}` : ""}`);

  return (
    <>
      <PageHeader
        title="Orders"
        description="Track sales orders, line items, and fulfillment status."
        actionHref="/orders/new"
        actionLabel="Create order"
      />

      <form className="mb-6">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by customer, employee, or status..."
          className="h-10 w-full max-w-md rounded-md border border-input bg-card px-3 text-sm"
        />
      </form>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="font-medium">#{order.id}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(order.orderDate)}
                    </div>
                  </TableCell>
                  <TableCell>{order.customer.name}</TableCell>
                  <TableCell>{order.employee.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "COMPLETED"
                          ? "success"
                          : order.status === "PENDING"
                            ? "warning"
                            : "destructive"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(Number(order.totalAmount))}</TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/orders/${order.id}`}
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
