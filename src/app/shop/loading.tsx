import { LoadingRegion, ProductGridSkeleton, Skeleton } from '@/components/Skeleton';

export default function Loading() {
  return (
    <LoadingRegion label="Loading products" className="mx-auto max-w-screen-2xl px-4 py-10 md:px-8">
      <Skeleton className="mb-8 h-9 w-40" />
      <div aria-hidden className="mb-10 flex flex-col gap-3 md:flex-row md:justify-between">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-4 w-56" />
      </div>
      <ProductGridSkeleton />
    </LoadingRegion>
  );
}
