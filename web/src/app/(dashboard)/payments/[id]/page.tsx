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
import { buttonVariants } from "@/components/ui/button";
import { deletePayment } from "@/app/actions/orders";
import { prisma } from "@/lib/prisma";
import { cn, formatCurrency } from "@/lib/utils";

export default async function PaymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const payment = await prisma.payment.findUnique({
    where: { id: Number(id) },
    include: { order: { include: { customer: true } } },
  });

  if (!payment) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={`Payment #${payment.id}`}
        description={`Order #${payment.orderId} · ${payment.order.customer.name}`}
        actionHref={`/payments/${payment.id}/edit`}
        actionLabel="Edit"
      />

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Payment details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <span className="text-muted-foreground">Amount:</span>{" "}
            {formatCurrency(Number(payment.amount))}
          </p>
          <p>
            <span className="text-muted-foreground">Method:</span> {payment.method}
          </p>
          <p className="flex items-center gap-2">
            <span className="text-muted-foreground">Status:</span>
            <Badge variant={payment.status === "PAID" ? "success" : "warning"}>
              {payment.status}
            </Badge>
          </p>
          <Link href={`/orders/${payment.orderId}`} className="inline-block font-medium hover:underline">
            View order #{payment.orderId}
          </Link>
        </CardContent>
      </Card>

      <form action={deletePayment.bind(null, payment.id)} className="mt-8">
        <button type="submit" className={cn(buttonVariants({ variant: "destructive" }))}>
          Delete payment
        </button>
      </form>
    </>
  );
}
