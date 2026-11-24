import type { Metadata } from "next";
import { Suspense } from "react";
import { getCategories, getProducts } from "@/lib/products";
import ProductGrid from "@/components/ProductGrid";
import ShopFilters from "@/components/ShopFilters";
import { ProductGridSkeleton } from "@/components/Skeleton";
import { shopCategories } from "@/config/site";
import type { Gender, SortKey } from "@/types";

export const metadata: Metadata = { title: "Shop" };

const GENDERS: Gender[] = ["men", "women"];
const SORTS: SortKey[] = ["price-asc", "price-desc"];
const GENDER_LABELS: Record<Gender, string> = {
  men: "Men",
  women: "Women",
  unisex: "Unisex",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

const humanize = (slug: string) =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

// Fetches and renders the products. It lives in its own component so the page shell (title and
// filters) can show immediately while this part streams in behind a skeleton.
async function ShopProducts({
  gender,
  category,
  sort,
}: {
  gender?: Gender;
  category?: string;
  sort?: SortKey;
}) {
  const products = await getProducts({ gender, category, sort });
  return <ProductGrid products={products} />;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const gender = GENDERS.find((g) => g === first(sp.gender));
  const sort = SORTS.find((s) => s === first(sp.sort));
  const category = first(sp.category);

  const dbCategories = await getCategories();

  // Categories from the database, plus any store categories (Hoodies, Sweats, Plain Tees...)
  // that aren't in the database yet, so every menu link has a matching filter option.
  const categories = [
    ...dbCategories.map(({ slug, name }) => ({ slug, name })),
    ...shopCategories.filter(
      (c) => !dbCategories.some((d) => d.slug === c.slug),
    ),
  ];

  const categoryName = category
    ? (categories.find((c) => c.slug === category)?.name ?? humanize(category))
    : undefined;
  const title =
    [gender && GENDER_LABELS[gender], categoryName]
      .filter(Boolean)
      .join(" / ") || "Shop";

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-10 md:px-8">
      <h1 className="mb-8 text-3xl font-medium tracking-tight">{title}</h1>
      <div className="mb-10">
        <ShopFilters
          categories={categories}
          active={{ gender, category, sort }}
        />
      </div>
      {/* key changes with the filters, so the skeleton shows again on every filter or sort click */}
      <Suspense
        key={`${gender ?? ""}|${category ?? ""}|${sort ?? ""}`}
        fallback={<ProductGridSkeleton />}
      >
        <ShopProducts gender={gender} category={category} sort={sort} />
      </Suspense>
    </div>
  );
}
