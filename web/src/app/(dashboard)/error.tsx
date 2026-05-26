"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isApi = error instanceof ApiError || error.name === "ApiError";
  const title = isApi ? "Could not load data" : "Something went wrong";
  const description = isApi
    ? error.message
    : "An unexpected error occurred. Try again or return to the dashboard.";

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 rounded-xl border border-border bg-card p-6">
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={() => reset()}>
          Try again
        </Button>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Dashboard
        </Link>
      </div>
    </div>
  );
}
