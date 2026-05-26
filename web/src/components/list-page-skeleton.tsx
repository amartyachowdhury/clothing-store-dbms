import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";

type ListPageSkeletonProps = {
  title: string;
  description: string;
};

export function ListPageSkeleton({ title, description }: ListPageSkeletonProps) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <Skeleton className="mb-6 h-10 w-full max-w-md" />
      <div className="rounded-xl border border-border bg-card p-4">
        <Skeleton className="mb-3 h-8 w-full" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="mb-2 h-10 w-full" />
        ))}
      </div>
    </>
  );
}
