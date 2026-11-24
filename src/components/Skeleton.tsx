import type { ReactNode } from "react";

/** A single pulsing placeholder block. Pass sizing/shape via className. */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`bg-neutral-200 motion-safe:animate-pulse ${className}`}
    />
  );
}

/** Wraps a skeleton so screen readers hear one "Loading..." message instead of empty blocks. */
export function LoadingRegion({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div role="status" aria-busy="true" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

/** Mirrors ProductGrid + ProductCard (4:5 image, name and price underneath). */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      aria-hidden
      className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4"
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          <Skeleton className="aspect-[4/5] w-full" />
          <div className="mt-3 flex justify-between gap-4">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Results area of the search page: result count line plus the product grid. */
export function SearchResultsSkeleton() {
  return (
    <LoadingRegion label="Loading results">
      <Skeleton className="mb-8 mt-16 h-3 w-40" />
      <ProductGridSkeleton />
    </LoadingRegion>
  );
}

/** Mirrors the "Similar products" section on the product page. */
export function SimilarProductsSkeleton() {
  return (
    <div aria-hidden className="mt-24">
      <Skeleton className="mb-6 h-6 w-40" />
      <ProductGridSkeleton count={4} />
    </div>
  );
}

/** Mirrors CheckoutForm: delivery fields on the left, order summary on the right. */
export function CheckoutSkeleton() {
  return (
    <LoadingRegion
      label="Loading checkout"
      className="grid gap-12 lg:grid-cols-[1fr_420px]"
    >
      <div aria-hidden className="grid gap-5">
        <Skeleton className="h-6 w-48" />
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="grid gap-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
        <Skeleton className="mt-2 h-12 w-full" />
      </div>

      <div aria-hidden className="h-fit bg-neutral-50 p-6">
        <Skeleton className="mb-4 h-6 w-40" />
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="flex gap-4 border-t border-neutral-200 py-4">
            <Skeleton className="aspect-[4/5] w-16 shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-4 w-14" />
          </div>
        ))}
        <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </LoadingRegion>
  );
}
