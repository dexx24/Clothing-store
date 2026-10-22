import Link from "next/link";
import { getCategories, getFeaturedProduct, getProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import ProductCarousel, {
  CAROUSEL_ITEM_CLASS,
} from "@/components/ProductCarousel";
import ProductGrid from "@/components/ProductGrid";
import { homeImages, placeholderImages } from "@/config/site";

export const revalidate = 60;

const cssUrl = (url: string) => `url(${JSON.stringify(url)})`;

// Layers paint top to bottom: overlay first, then each image. If a file is missing the browser
// simply skips that layer, so the next one (or the section's background colour) shows instead.
const backdrop = (overlay: string | null, ...images: (string | undefined)[]) =>
  [overlay, ...images.filter((i): i is string => Boolean(i)).map(cssUrl)]
    .filter(Boolean)
    .join(", ");

export default async function HomePage() {
  const [featured, latest, categories, hoodies, sweats] = await Promise.all([
    getFeaturedProduct(),
    getProducts({ limit: 8 }),
    getCategories(),
    getProducts({ category: "hoodies", limit: 12 }),
    getProducts({ category: "sweats", limit: 12 }),
  ]);

  // Homepage shows only the categories that have a tile image in homeImages.categories (Tops, Bottoms),
  // in that order, rather than every category in the database.
  const featuredCategories = Object.keys(homeImages.categories)
    .map((slug) => categories.find((c) => c.slug === slug))
    .filter((c): c is (typeof categories)[number] => Boolean(c));

  const carousels = [
    { title: "Hoodies", slug: "hoodies", products: hoodies },
    { title: "Sweats", slug: "sweats", products: sweats },
  ].filter((c) => c.products.length > 0); // skip a carousel entirely when its category is empty

  return (
    <>
      <section
        className="relative h-[calc(100dvh-4rem)] min-h-[480px] bg-neutral-700 bg-cover bg-center md:h-[calc(100dvh-5rem)]"
        style={{
          backgroundImage: backdrop(
            "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.2) 55%, rgba(0,0,0,0.25))",
            homeImages.hero,
            featured?.images[0], // fallback until /public/images/home-hero.jpg exists
          ),
        }}
      >
        <div className="absolute bottom-0 left-0 max-w-full p-6 text-white md:p-12">
          <p className="mb-2 text-sm">
            {featured ? featured.name : "New season"}
          </p>
          <h1 className="max-w-xl text-4xl font-medium leading-tight tracking-tight md:text-6xl">
            Everyday clothes, made to last.
          </h1>
          <Link
            href={featured ? `/product/${featured.slug}` : "/shop"}
            className="mt-6 inline-block bg-white px-6 py-3 text-sm text-neutral-900 hover:bg-neutral-200"
          >
            {featured ? "Shop this piece" : "Shop the collection"}
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <section
          aria-label="Categories"
          className="mt-16 grid gap-4 md:grid-cols-2"
        >
          {featuredCategories.map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              className="group relative flex h-64 items-end overflow-hidden bg-neutral-700 bg-cover bg-center p-6 text-3xl font-medium tracking-tight text-white md:h-80"
              style={{
                backgroundImage: backdrop(
                  null,
                  homeImages.categories[c.slug],
                  placeholderImages.categories[c.slug],
                ),
              }}
            >
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 transition-colors group-hover:from-black/70"
              />
              <span className="relative">{c.name}</span>
            </Link>
          ))}
        </section>

        <section aria-labelledby="new" className="mt-24">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 id="new" className="text-lg font-medium tracking-tight">
              New arrivals
            </h2>
            <Link href="/shop" className="text-sm underline underline-offset-4">
              View all
            </Link>
          </div>
          <ProductGrid products={latest} />
        </section>

        {carousels.map((c) => (
          <ProductCarousel
            key={c.slug}
            title={c.title}
            viewAllHref={`/shop?category=${c.slug}`}
          >
            {c.products.map((p) => (
              <li key={p.id} className={CAROUSEL_ITEM_CLASS}>
                <ProductCard product={p} />
              </li>
            ))}
          </ProductCarousel>
        ))}
      </div>

      <section
        aria-labelledby="closing-heading"
        className="relative mt-24 flex min-h-[420px] items-center justify-center bg-neutral-800 bg-cover bg-center px-6 py-24 text-center text-white md:min-h-[560px]"
        style={{
          backgroundImage: backdrop(
            "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45))",
            homeImages.closing,
            placeholderImages.closing,
          ),
        }}
      >
        <div>
          <h2
            id="closing-heading"
            className="text-3xl font-medium tracking-tight md:text-5xl"
          >
            Find your next favorite.
          </h2>
          <Link
            href="/shop"
            className="mt-8 inline-block bg-white px-6 py-3 text-sm text-neutral-900 hover:bg-neutral-200"
          >
            Shop all
          </Link>
        </div>
      </section>
    </>
  );
}
