import { LoadingRegion, SimilarProductsSkeleton, Skeleton } from '@/components/Skeleton';

// Mirrors the product page: gallery (main image + thumbnails) and the purchase column.
export default function Loading() {
  return (
    <LoadingRegion label="Loading product" className="mx-auto max-w-screen-2xl px-4 py-8 md:px-8">
      <div aria-hidden className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <Skeleton className="aspect-[4/5] w-full" />
          <div className="mt-3 grid grid-cols-5 gap-3">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="aspect-[4/5] w-full" />
            ))}
          </div>
        </div>

        <div>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="mt-3 h-6 w-24" />

          <Skeleton className="mt-8 h-4 w-28" />
          <div className="mt-3 flex gap-3">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-full" />
            ))}
          </div>

          <Skeleton className="mt-6 h-4 w-12" />
          <div className="mt-3 flex gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-10 w-12" />
            ))}
          </div>

          <Skeleton className="mt-6 h-4 w-16" />
          <Skeleton className="mt-3 h-11 w-32" />

          <div className="mt-8 grid gap-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>

          <div className="mt-10 space-y-2 border-t border-neutral-200 pt-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
      <SimilarProductsSkeleton />
    </LoadingRegion>
  );
}
