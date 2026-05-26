import { ListPageSkeleton } from "@/components/list-page-skeleton";

export default function Loading() {
  return (
    <ListPageSkeleton
      title="Orders"
      description="Track purchases and fulfillment status."
    />
  );
}
