import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description ? (
          <p className="mt-2 text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className={cn(buttonVariants())}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
