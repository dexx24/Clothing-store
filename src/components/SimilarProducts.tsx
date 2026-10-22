import { getSimilarProducts } from '@/lib/products';
import ProductGrid from './ProductGrid';

export default async function SimilarProducts({ product }: { product: { id: string; category_id: string } }) {
  const products = await getSimilarProducts(product);
  if (products.length === 0) return null;

  return (
    <section aria-labelledby="similar" className="mt-24">
      <h2 id="similar" className="mb-6 text-lg font-medium tracking-tight">
        Similar products
      </h2>
      <ProductGrid products={products} />
    </section>
  );
}
