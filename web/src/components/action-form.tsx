"use client";

import { useActionState, useEffect } from "react";
import type { FormState } from "@/lib/form-action";
import { useToast } from "@/components/toast-provider";

type ActionFormProps = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  children: React.ReactNode;
  className?: string;
};

export function ActionForm({ action, children, className }: ActionFormProps) {
  const { push } = useToast();
  const [state, formAction] = useActionState(action, {});

  useEffect(() => {
    if (state.error) {
      push({ message: state.error, variant: "error" });
    }
  }, [state.error, push]);

  return (
    <form action={formAction} className={className}>
      {children}
    </form>
  );
}
