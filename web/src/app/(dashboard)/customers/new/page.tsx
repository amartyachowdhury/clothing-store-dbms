import { PageHeader } from "@/components/page-header";
import { Label, Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { createCustomer } from "@/app/actions/customers";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NewCustomerPage() {
  return (
    <>
      <PageHeader
        title="New customer"
        description="Create a customer record for order processing."
      />

      <form action={createCustomer} className="max-w-xl space-y-4 rounded-xl border border-border bg-card p-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" required />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className={cn(buttonVariants())}>
            Create customer
          </button>
          <Link href="/customers" className={cn(buttonVariants({ variant: "outline" }))}>
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
