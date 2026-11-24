import { LoadingRegion, ProductGridSkeleton, Skeleton } from '@/components/Skeleton';

// Mirrors the search page: logo bar, shop links (desktop), search field, results grid.
export default function Loading() {
  return (
    <LoadingRegion label="Loading search" className="min-h-dvh bg-white">
      <div aria-hidden className="relative mx-auto flex h-16 max-w-screen-2xl items-center justify-center px-4 md:h-20 md:px-8">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="absolute right-4 h-4 w-12 md:right-8" />
      </div>

      <div
        aria-hidden
        className="mx-auto grid max-w-screen-2xl gap-12 px-4 pb-24 pt-10 md:px-8 lg:grid-cols-[200px_1fr] lg:gap-20 lg:pt-16"
      >
        <div className="hidden space-y-4 lg:block">
          <Skeleton className="mb-6 h-3 w-12" />
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-4 w-24" />
          ))}
        </div>

        <div>
          <Skeleton className="mb-1 h-3 w-20" />
          <Skeleton className="h-12 w-full lg:max-w-3xl" />
          <div className="mt-6 flex flex-wrap gap-5">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-4 w-16" />
            ))}
          </div>
          <Skeleton className="mb-8 mt-16 h-3 w-40" />
          <ProductGridSkeleton />
        </div>
      </div>
    </LoadingRegion>
  );
}
