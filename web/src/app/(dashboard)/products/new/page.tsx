import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Label, Input, Select } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { createProduct } from "@/app/actions/products";
import { apiJson } from "@/lib/api";
import { cn } from "@/lib/utils";

export default async function NewProductPage() {
  const categories = await apiJson<Array<{ id: number; name: string }>>(
    "/categories",
  );

  return (
    <>
      <PageHeader
        title="New product"
        description="Add an item to the clothing catalog."
      />

      <form action={createProduct} className="max-w-xl space-y-4 rounded-xl border border-border bg-card p-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input id="brand" name="brand" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <Select id="categoryId" name="categoryId" required defaultValue="">
              <option value="" disabled>
                Select category
              </option>
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
            <Input id="size" name="size" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="colour">Colour</Label>
            <Input id="colour" name="colour" required />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input id="price" name="price" type="number" step="0.01" min="0.01" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stockQty">Stock quantity</Label>
            <Input id="stockQty" name="stockQty" type="number" min="0" required />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className={cn(buttonVariants())}>
            Create product
          </button>
          <Link href="/products" className={cn(buttonVariants({ variant: "outline" }))}>
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
