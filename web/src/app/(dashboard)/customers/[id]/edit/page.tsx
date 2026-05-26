import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Label, Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { updateCustomer } from "@/app/actions/customers";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({
    where: { id: Number(id) },
  });

  if (!customer) {
    notFound();
  }

  const updateAction = updateCustomer.bind(null, customer.id);

  return (
    <>
      <PageHeader title="Edit customer" description={`Update ${customer.name}.`} />

      <form action={updateAction} className="max-w-xl space-y-4 rounded-xl border border-border bg-card p-6">
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
          <button type="submit" className={cn(buttonVariants())}>
            Save changes
          </button>
          <Link
            href={`/customers/${customer.id}`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
