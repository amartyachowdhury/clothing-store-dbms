import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Label, Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { createCustomerFormAction } from "@/app/actions/customers";
import { ActionForm } from "@/components/action-form";
import { SubmitButton } from "@/components/submit-button";
import { cn } from "@/lib/utils";

export default function NewCustomerPage() {
  return (
    <>
      <PageHeader
        title="New customer"
        description="Create a customer record for order processing."
      />

      <ActionForm
        action={createCustomerFormAction}
        className="max-w-xl space-y-4 rounded-xl border border-border bg-card p-6"
      >
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
          <SubmitButton pendingLabel="Creating…">Create customer</SubmitButton>
          <Link href="/customers" className={cn(buttonVariants({ variant: "outline" }))}>
            Cancel
          </Link>
        </div>
      </ActionForm>
    </>
  );
}
