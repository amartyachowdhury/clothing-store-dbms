import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Label, Input, Select } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { updateProductFormAction } from "@/app/actions/products";
import { ActionForm } from "@/components/action-form";
import { SubmitButton } from "@/components/submit-button";
import { apiJson } from "@/lib/api";
import { cn } from "@/lib/utils";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    apiJson<
      | {
          id: number;
          name: string;
          brand: string;
          size: string;
          colour: string;
          price: string | number;
          stockQty: number;
          categoryId: number;
        }
      | null
    >(`/products/${Number(id)}`),
    apiJson<Array<{ id: number; name: string }>>("/categories"),
  ]);

  if (!product) {
    notFound();
  }

  const updateAction = updateProductFormAction.bind(null, product.id);

  return (
    <>
      <PageHeader title="Edit product" description={`Update ${product.name}.`} />

      <ActionForm action={updateAction} className="max-w-xl space-y-4 rounded-xl border border-border bg-card p-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={product.name} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input id="brand" name="brand" defaultValue={product.brand} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <Select
              id="categoryId"
              name="categoryId"
              defaultValue={String(product.categoryId)}
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="size">Size</Label>
            <Input id="size" name="size" defaultValue={product.size} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="colour">Colour</Label>
            <Input id="colour" name="colour" defaultValue={product.colour} required />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0.01"
              defaultValue={Number(product.price)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stockQty">Stock quantity</Label>
            <Input
              id="stockQty"
              name="stockQty"
              type="number"
              min="0"
              defaultValue={product.stockQty}
              required
            />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
          <Link
            href={`/products/${product.id}`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Cancel
          </Link>
        </div>
      </ActionForm>
    </>
  );
}
