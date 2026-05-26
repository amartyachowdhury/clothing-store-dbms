import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { deleteProduct } from "@/app/actions/products";
import { prisma } from "@/lib/prisma";
import { cn, formatCurrency } from "@/lib/utils";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { category: true },
  });

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

      <form action={deleteProduct.bind(null, product.id)} className="mt-8">
        <button type="submit" className={cn(buttonVariants({ variant: "destructive" }))}>
          Delete product
        </button>
      </form>
    </>
  );
}
