"use server";

import { apiJson } from "@/lib/api";
import { type FormState, runFormAction } from "@/lib/form-action";
import { customerSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCustomer(formData: FormData) {
  const parsed = customerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid customer data");
  }

  const customer = await apiJson<{ id: number; error?: string }>("/customers", {
    method: "POST",
    body: JSON.stringify({
      name: parsed.data.name,
      email: parsed.data.email || "",
      phone: parsed.data.phone,
    }),
  });

  if ("error" in customer && customer.error) {
    throw new Error(customer.error);
  }

  revalidatePath("/customers");
  redirect(`/customers/${customer.id}`);
}

export async function updateCustomer(id: number, formData: FormData) {
  const parsed = customerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid customer data");
  }

  const result = await apiJson<{ error?: string }>(`/customers/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      name: parsed.data.name,
      email: parsed.data.email || "",
      phone: parsed.data.phone,
    }),
  });

  if (result?.error) {
    throw new Error(result.error);
  }

  revalidatePath("/customers");
  revalidatePath(`/customers/${id}`);
  redirect(`/customers/${id}`);
}

export async function deleteCustomer(id: number) {
  const result = await apiJson<{ ok?: boolean; error?: string }>(
    `/customers/${id}`,
    { method: "DELETE" },
  );
  if (result?.error) {
    throw new Error(result.error);
  }
  revalidatePath("/customers");
  redirect("/customers");
}

export async function createCustomerFormAction(
  _prev: FormState,
  formData: FormData,
) {
  return runFormAction(() => createCustomer(formData));
}

export async function updateCustomerFormAction(
  id: number,
  _prev: FormState,
  formData: FormData,
) {
  return runFormAction(() => updateCustomer(id, formData));
}

export async function deleteCustomerFormAction(
  id: number,
  _prev: FormState,
  _formData: FormData,
) {
  return runFormAction(() => deleteCustomer(id));
}
