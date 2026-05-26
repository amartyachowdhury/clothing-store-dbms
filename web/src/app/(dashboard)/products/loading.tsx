import { ListPageSkeleton } from "@/components/list-page-skeleton";

export default function Loading() {
  return (
    <ListPageSkeleton
      title="Products"
      description="Manage inventory, pricing, and categories."
    />
  );
}
