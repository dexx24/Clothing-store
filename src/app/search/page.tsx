import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { searchProducts } from "@/lib/products";
import Logo from "@/components/Logo";
import ProductGrid from "@/components/ProductGrid";
import SearchField from "@/components/SearchField";
import { SearchResultsSkeleton } from "@/components/Skeleton";
import { navigation, shopCategories } from "@/config/site";

export const metadata: Metadata = { title: "Search", robots: { index: false } };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

const sectionLabel = "text-xs font-medium uppercase tracking-[0.14em]";

// Runs the search and renders the results. Separate component so the search box and links
// stay put while this part shows a skeleton on every new search.
async function SearchResults({ query }: { query: string }) {
  const { products, matchedAll } = await searchProducts(query);

  return (
    <>
      <p
        role="status"
        aria-live="polite"
        className={`${sectionLabel} mb-8 mt-16`}
      >
        {query
          ? `${products.length} ${products.length === 1 ? "result" : "results"} for \u201C${query}\u201D`
          : "All products"}
      </p>

      {products.length > 0 && !matchedAll && (
        <p className="-mt-4 mb-8 text-sm font-light text-neutral-500">
          No product matches every word, so these are the closest matches.
        </p>
      )}

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="py-16 lg:max-w-xl">
          <p className="text-2xl font-light tracking-tight">
            No products found
          </p>
          <p className="mt-3 font-light text-neutral-600">
            {query ? `Nothing matched \u201C${query}\u201D. ` : ""}Check the
            spelling, try fewer or different words, or browse a category.
          </p>
          <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {shopCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/search?q=${encodeURIComponent(c.name)}`}
                className="font-light underline underline-offset-4 hover:text-neutral-500"
              >
                {c.name}
              </Link>
            ))}
            <Link
              href="/shop"
              className="underline underline-offset-4 hover:text-neutral-500"
            >
              Shop all
            </Link>
          </p>
        </div>
      )}
    </>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const query = (first(sp.q) ?? "").trim().slice(0, 100);

  return (
    <div className="min-h-dvh bg-white">
      <div className="relative mx-auto flex h-16 max-w-screen-2xl items-center justify-center px-4 md:h-20 md:px-8">
        <Logo />
        <Link
          href="/"
          className="absolute right-4 text-sm underline underline-offset-4 hover:text-neutral-500 md:right-8"
        >
          Close
        </Link>
      </div>

      <div className="mx-auto grid max-w-screen-2xl gap-12 px-4 pb-24 pt-10 md:px-8 lg:grid-cols-[200px_1fr] lg:gap-20 lg:pt-16">
        <nav aria-labelledby="search-shop-links" className="hidden lg:block">
          <h2 id="search-shop-links" className={`${sectionLabel} mb-6`}>
            Shop
          </h2>
          <ul className="space-y-4 font-light">
            {navigation.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="underline underline-offset-4 hover:text-neutral-500"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h1 className="sr-only">Search</h1>

          <SearchField initialQuery={query} />

          <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm lg:max-w-3xl">
            <span className="text-neutral-500">Browse</span>
            {shopCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/search?q=${encodeURIComponent(c.name)}`}
                className="font-light underline underline-offset-4 hover:text-neutral-500"
              >
                {c.name}
              </Link>
            ))}
          </p>

          {/* key changes with the query, so the skeleton shows again on every new search */}
          <Suspense key={query} fallback={<SearchResultsSkeleton />}>
            <SearchResults query={query} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
