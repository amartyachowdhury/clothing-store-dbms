import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Label, Input, Select } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { createOrderFormAction } from "@/app/actions/orders";
import { ActionForm } from "@/components/action-form";
import { SubmitButton } from "@/components/submit-button";
import { apiJson } from "@/lib/api";
import { cn } from "@/lib/utils";

export default async function NewOrderPage() {
  const [customers, employees] = await Promise.all([
    apiJson<Array<{ id: number; name: string }>>("/customers"),
    apiJson<Array<{ id: number; name: string; role: string }>>("/employees"),
  ]);

  return (
    <>
      <PageHeader
        title="Create order"
        description="Start a new order, then add line items on the detail page."
      />

      <ActionForm action={createOrderFormAction} className="max-w-xl space-y-4 rounded-xl border border-border bg-card p-6">
        <div className="space-y-2">
          <Label htmlFor="customerId">Customer</Label>
          <Select id="customerId" name="customerId" required defaultValue="">
            <option value="" disabled>
              Select customer
            </option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="employeeId">Employee</Label>
          <Select id="employeeId" name="employeeId" required defaultValue="">
            <option value="" disabled>
              Select employee
            </option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name} ({employee.role})
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="orderDate">Order date</Label>
          <Input
            id="orderDate"
            name="orderDate"
            type="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
          />
        </div>
        <div className="flex gap-3 pt-2">
          <SubmitButton pendingLabel="Creating…">Create order</SubmitButton>
          <Link href="/orders" className={cn(buttonVariants({ variant: "outline" }))}>
            Cancel
          </Link>
        </div>
      </ActionForm>
    </>
  );
}
