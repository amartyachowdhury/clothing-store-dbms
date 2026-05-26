import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { deleteCustomer } from "@/app/actions/customers";
import { apiJson } from "@/lib/api";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customerId = Number(id);

  const customer = await apiJson<{
    id: number;
    name: string;
    email: string | null;
    phone: string;
    orders: Array<{ id: number; orderDate: string; totalAmount: string | number }>;
  } | null>(`/customers/${customerId}`);

  if (!customer) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={customer.name}
        description="Customer profile and recent orders."
        actionHref={`/customers/${customer.id}/edit`}
        actionLabel="Edit"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Email:</span>{" "}
              {customer.email ?? "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Phone:</span>{" "}
              {customer.phone}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {customer.orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              customer.orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between text-sm"
                >
                  <Link href={`/orders/${order.id}`} className="hover:underline">
                    Order #{order.id} · {formatDate(order.orderDate)}
                  </Link>
                  <span>{formatCurrency(Number(order.totalAmount))}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <form action={deleteCustomer.bind(null, customer.id)} className="mt-8">
        <button type="submit" className={cn(buttonVariants({ variant: "destructive" }))}>
          Delete customer
        </button>
      </form>
    </>
  );
}
