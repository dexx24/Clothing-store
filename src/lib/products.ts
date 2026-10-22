import { supabase } from './supabase';
import { parseQuery } from './search-query';
import type { Category, Gender, Product, ProductFilters } from '@/types';

const COLUMNS =
  'id, slug, name, description, price_cents, gender, images, colors, sizes, is_featured';

export async function getProducts({ gender, category, sort = 'newest', limit }: ProductFilters = {}) {
  // !inner turns the category join into a filter only when a category is requested.
  const join = category ? 'category:categories!inner(slug, name)' : 'category:categories(slug, name)';
  let query = supabase.from('products').select(`${COLUMNS}, ${join}`);

  if (category) query = query.eq('category.slug', category);
  if (gender) query = query.in('gender', [gender, 'unisex']);

  if (sort === 'price-asc') query = query.order('price_cents', { ascending: true });
  else if (sort === 'price-desc') query = query.order('price_cents', { ascending: false });
  else query = query.order('created_at', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Product[];
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`${COLUMNS}, category_id, category:categories(slug, name)`)
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as unknown as (Product & { category_id: string }) | null;
}

export async function getFeaturedProduct() {
  const { data, error } = await supabase
    .from('products')
    .select(`${COLUMNS}, category:categories(slug, name)`)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as unknown as Product | null;
}

export async function getSimilarProducts(product: { id: string; category_id: string }, limit = 4) {
  const { data, error } = await supabase
    .from('products')
    .select(`${COLUMNS}, category:categories(slug, name)`)
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Product[];
}

export async function getCategories() {
  const { data, error } = await supabase.from('categories').select('id, slug, name').order('name');
  if (error) throw new Error(error.message);
  return (data ?? []) as Category[];
}

// --- Search -----------------------------------------------------------------------------------

function relevance(product: Product, terms: string[], phrase: string) {
  const name = product.name.toLowerCase();
  const description = product.description.toLowerCase();
  const category = (product.category?.name ?? '').toLowerCase();

  let score = 0;
  if (phrase && name.includes(phrase)) score += 5;
  else if (phrase && description.includes(phrase)) score += 2;
  for (const t of terms) {
    if (name.includes(t)) score += 3;
    if (category.includes(t)) score += 2;
    if (description.includes(t)) score += 1;
  }
  return score;
}

export interface SearchResult {
  products: Product[];
  /** false when no product matched every word, so these are partial matches. */
  matchedAll: boolean;
}

/**
 * Case-insensitive search over product name, description and category name.
 *
 * "blue hoodies" first looks for products where EVERY word matches somewhere (name, description
 * or category). If there are none, it falls back to products matching ANY word and says so.
 * "men" / "women" in the query narrow by gender (unisex items included). An empty query returns
 * the whole catalogue.
 */
export async function searchProducts(query = ''): Promise<SearchResult> {
  const { terms, phrase, gender } = parseQuery(query);

  let categories: { id: string; name: string }[] = [];
  if (terms.length > 0) {
    const { data, error } = await supabase.from('categories').select('id, name');
    if (error) throw new Error(error.message);
    categories = (data ?? []) as { id: string; name: string }[];
  }

  const clausesFor = (term: string) => {
    const clauses = [`name.ilike.%${term}%`, `description.ilike.%${term}%`];
    const ids = categories.filter((c) => c.name.toLowerCase().includes(term)).map((c) => c.id);
    if (ids.length > 0) clauses.push(`category_id.in.(${ids.join(',')})`);
    return clauses;
  };

  async function run(mode: 'all' | 'any') {
    let q = supabase
      .from('products')
      .select(`${COLUMNS}, category_id, category:categories(slug, name)`);

    if (mode === 'all') {
      for (const t of terms) q = q.or(clausesFor(t).join(',')); // each .or() is ANDed with the others
    } else {
      q = q.or(terms.flatMap(clausesFor).join(','));
    }
    if (gender) q = q.in('gender', [gender, 'unisex']);

    const { data, error } = await q.order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    const products = (data ?? []) as unknown as Product[];
    return [...products].sort((a, b) => relevance(b, terms, phrase) - relevance(a, terms, phrase));
  }

  if (terms.length === 0) {
    let q = supabase.from('products').select(`${COLUMNS}, category:categories(slug, name)`);
    if (gender) q = q.in('gender', [gender, 'unisex']);
    const { data, error } = await q.order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return { products: (data ?? []) as unknown as Product[], matchedAll: true };
  }

  const strict = await run('all');
  if (strict.length > 0 || terms.length === 1) return { products: strict, matchedAll: true };
  return { products: await run('any'), matchedAll: false };
}
