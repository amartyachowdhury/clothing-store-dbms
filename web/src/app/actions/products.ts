"use server";

import { prisma } from "@/lib/prisma";
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

  const product = await prisma.product.create({
    data: parsed.data,
  });

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

  await prisma.product.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  redirect(`/products/${id}`);
}

export async function deleteProduct(id: number) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/products");
  redirect("/products");
}
