"use server";

import { apiJson } from "@/lib/api";
import { productSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    size: formData.get("size"),
    colour: formData.get("colour"),
    brand: formData.get("brand"),
    price: formData.get("price"),
    stockQty: formData.get("stockQty"),
    categoryId: formData.get("categoryId"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid product data");
  }

  const product = await apiJson<{ id: number; error?: string }>("/products", {
    method: "POST",
    body: JSON.stringify(parsed.data),
  });

  if ("error" in product && product.error) {
    throw new Error(product.error);
  }

  revalidatePath("/products");
  redirect(`/products/${product.id}`);
}

export async function updateProduct(id: number, formData: FormData) {
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    size: formData.get("size"),
    colour: formData.get("colour"),
    brand: formData.get("brand"),
    price: formData.get("price"),
    stockQty: formData.get("stockQty"),
    categoryId: formData.get("categoryId"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid product data");
  }

  const result = await apiJson<{ error?: string }>(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(parsed.data),
  });
  if (result?.error) {
    throw new Error(result.error);
  }

  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  redirect(`/products/${id}`);
}

export async function deleteProduct(id: number) {
  const result = await apiJson<{ ok?: boolean; error?: string }>(
    `/products/${id}`,
    { method: "DELETE" },
  );
  if (result?.error) {
    throw new Error(result.error);
  }
  revalidatePath("/products");
  redirect("/products");
}
