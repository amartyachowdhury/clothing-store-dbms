import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteProductFormAction } from "@/app/actions/products";
import { ActionForm } from "@/components/action-form";
import { SubmitButton } from "@/components/submit-button";
import { apiJson } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await apiJson<
    | {
        id: number;
        name: string;
        brand: string;
        size: string;
        colour: string;
        price: string | number;
        stockQty: number;
        category: { name: string };
      }
    | null
  >(`/products/${Number(id)}`);

  if (!product) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={product.name}
        description={`${product.brand} · ${product.category.name}`}
        actionHref={`/products/${product.id}/edit`}
        actionLabel="Edit"
      />

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Product details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Size:</span> {product.size}
          </p>
          <p>
            <span className="text-muted-foreground">Colour:</span> {product.colour}
          </p>
          <p>
            <span className="text-muted-foreground">Price:</span>{" "}
            {formatCurrency(Number(product.price))}
          </p>
          <p>
            <span className="text-muted-foreground">Stock:</span> {product.stockQty}
          </p>
        </CardContent>
      </Card>

      <ActionForm
        action={deleteProductFormAction.bind(null, product.id)}
        className="mt-8"
      >
        <SubmitButton variant="destructive" pendingLabel="Deleting…">
          Delete product
        </SubmitButton>
      </ActionForm>
    </>
  );
}
