import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label, Input, Select } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import {
  addOrderItem,
  deleteOrder,
  removeOrderItem,
} from "@/app/actions/orders";
import { getOrderWithDetails } from "@/lib/services/orders";
import { apiJson } from "@/lib/api";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderId = Number(id);

  const [order, products] = await Promise.all([
    getOrderWithDetails(orderId),
    apiJson<Array<{ id: number; name: string; price: string | number }>>(
      "/products",
    ),
  ]);

  if (!order) {
    notFound();
  }

  const addItemAction = addOrderItem.bind(null, orderId);

  return (
    <>
      <PageHeader
        title={`Order #${order.id}`}
        description={`Placed on ${formatDate(order.orderDate)}`}
        actionHref={`/payments/new?orderId=${order.id}`}
        actionLabel="Record payment"
      />

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
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
            <p className="mt-4 text-2xl font-semibold">
              {formatCurrency(Number(order.totalAmount))}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <Link href={`/customers/${order.customer.id}`} className="font-medium hover:underline">
              {order.customer.name}
            </Link>
            <p className="text-muted-foreground">{order.customer.phone}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employee</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="font-medium">{order.employee.name}</p>
            <p className="text-muted-foreground">{order.employee.role}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="mb-4 text-lg font-semibold">Line items</h2>
          <div className="rounded-xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Unit price</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground">
                      No items yet. Add products below.
                    </TableCell>
                  </TableRow>
                ) : (
                  order.items.map((item) => (
                    <TableRow key={`${item.orderId}-${item.productId}`}>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatCurrency(Number(item.unitPrice))}</TableCell>
                      <TableCell>
                        {formatCurrency(Number(item.unitPrice) * item.quantity)}
                      </TableCell>
                      <TableCell className="text-right">
                        <form action={removeOrderItem.bind(null, orderId, item.productId)}>
                          <button
                            type="submit"
                            className="text-sm text-destructive hover:underline"
                          >
                            Remove
                          </button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add line item</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={addItemAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productId">Product</Label>
                <Select id="productId" name="productId" required defaultValue="">
                  <option value="" disabled>
                    Select product
                  </option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({formatCurrency(Number(product.price))})
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" name="quantity" type="number" min="1" defaultValue="1" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit price</Label>
                <Input
                  id="unitPrice"
                  name="unitPrice"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>
              <button type="submit" className={cn(buttonVariants(), "w-full")}>
                Add item
              </button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Payments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {order.payments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No payments recorded.</p>
          ) : (
            order.payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between text-sm">
                <Link href={`/payments/${payment.id}`} className="hover:underline">
                  {payment.method} · {payment.status}
                </Link>
                <span>{formatCurrency(Number(payment.amount))}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <form action={deleteOrder.bind(null, orderId)} className="mt-8">
        <button type="submit" className={cn(buttonVariants({ variant: "destructive" }))}>
          Delete order
        </button>
      </form>
    </>
  );
}
