import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Label, Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { updateCustomerFormAction } from "@/app/actions/customers";
import { ActionForm } from "@/components/action-form";
import { SubmitButton } from "@/components/submit-button";
import { apiJson } from "@/lib/api";
import { cn } from "@/lib/utils";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await apiJson<
    { id: number; name: string; email: string | null; phone: string } | null
  >(`/customers/${Number(id)}`);

  if (!customer) {
    notFound();
  }

  const updateAction = updateCustomerFormAction.bind(null, customer.id);

  return (
    <>
      <PageHeader title="Edit customer" description={`Update ${customer.name}.`} />

      <ActionForm action={updateAction} className="max-w-xl space-y-4 rounded-xl border border-border bg-card p-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={customer.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={customer.email ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" defaultValue={customer.phone} required />
        </div>
        <div className="flex gap-3 pt-2">
          <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
          <Link
            href={`/customers/${customer.id}`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Cancel
          </Link>
        </div>
      </ActionForm>
    </>
  );
}
