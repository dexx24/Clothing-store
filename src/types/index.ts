export type Gender = 'men' | 'women' | 'unisex';
export type SortKey = 'newest' | 'price-asc' | 'price-desc';

export interface Category {
  id: string;
  slug: string;
  name: string;
}

export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_cents: number;
  gender: Gender;
  images: string[];
  colors: ColorOption[];
  sizes: string[];
  is_featured: boolean;
  category: Pick<Category, 'slug' | 'name'> | null;
}

export interface ProductFilters {
  gender?: Gender;
  category?: string;
  sort?: SortKey;
  limit?: number;
}

export interface CartItem {
  key: string; // productId|color|size
  productId: string;
  slug: string;
  name: string;
  image: string;
  priceCents: number;
  color: string;
  size: string;
  quantity: number;
}
