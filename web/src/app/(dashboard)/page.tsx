import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const [customerCount, productCount, orderCount, paymentCount, orders, lowStock] =
    await Promise.all([
      prisma.customer.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.payment.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { orderDate: "desc" },
        include: { customer: true },
      }),
      prisma.product.findMany({
        where: { stockQty: { lte: 10 } },
        orderBy: { stockQty: "asc" },
        take: 5,
      }),
    ]);

  const revenue = await prisma.payment.aggregate({
    where: { status: "PAID" },
    _sum: { amount: true },
  });

  const stats = [
    { label: "Customers", value: customerCount, href: "/customers" },
    { label: "Products", value: productCount, href: "/products" },
    { label: "Orders", value: orderCount, href: "/orders" },
    { label: "Payments", value: paymentCount, href: "/payments" },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of your clothing retail store operations."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-3xl">{stat.value}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue collected</CardTitle>
            <CardDescription>Total from paid payments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              {formatCurrency(Number(revenue._sum.amount ?? 0))}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low stock alerts</CardTitle>
            <CardDescription>Products with 10 or fewer units</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStock.length === 0 ? (
              <p className="text-sm text-muted-foreground">All products are well stocked.</p>
            ) : (
              lowStock.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between text-sm"
                >
                  <Link
                    href={`/products/${product.id}`}
                    className="font-medium hover:underline"
                  >
                    {product.name}
                  </Link>
                  <span className="text-muted-foreground">
                    {product.stockQty} left
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent orders</CardTitle>
          <CardDescription>Latest activity across the store</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <Link
                    href={`/orders/${order.id}`}
                    className="font-medium hover:underline"
                  >
                    Order #{order.id}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {order.customer.name}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p>{formatCurrency(Number(order.totalAmount))}</p>
                  <p className="text-muted-foreground">{order.status}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </>
  );
}
