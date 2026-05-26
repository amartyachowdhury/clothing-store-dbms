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
import { deletePaymentFormAction } from "@/app/actions/orders";
import { ActionForm } from "@/components/action-form";
import { SubmitButton } from "@/components/submit-button";
import { apiJson } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export default async function PaymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const payment = await apiJson<
    | {
        id: number;
        orderId: number;
        method: string;
        status: "PENDING" | "PAID";
        amount: string | number;
        order: { customer: { name: string } };
      }
    | null
  >(`/payments/${Number(id)}`);

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

      <ActionForm
        action={deletePaymentFormAction.bind(null, payment.id)}
        className="mt-8"
      >
        <SubmitButton variant="destructive" pendingLabel="Deleting…">
          Delete payment
        </SubmitButton>
      </ActionForm>
    </>
  );
}
