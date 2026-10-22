# Nove: minimalist fashion store

# supabase database password - u2ri3l5Pr5POPPGc

Next.js 15 (App Router) + TypeScript + Tailwind + Supabase. Server Components for all data pages; client JS only for the cart, gallery, purchase controls and checkout form.

## Setup

1. `npm install`
2. Create a Supabase project. In the SQL editor run `supabase/schema.sql`, then `supabase/seed.sql`.
3. `cp .env.example .env.local` and add your project URL and anon key (Project Settings > API).
4. `npm run dev` and open http://localhost:3000

## Structure

- `src/app`: routes (`/`, `/shop`, `/product/[slug]`, `/checkout`, `/checkout/success`) and the `placeOrder` server action
- `src/components`: Header, CartDrawer, ProductCard/Grid/Gallery/Purchase, ShopFilters, CheckoutForm, SimilarProducts
- `src/lib`: Supabase client, queries, price formatting
- `src/store/cart.ts`: Zustand cart (persisted to localStorage)
- `supabase/`: schema, RLS policies, `create_order` function, seed data

## Notes

- Orders are created through the `create_order` Postgres function, which re-reads prices from `products`, so the client can't change what it pays.
- Checkout records the order as `pending`. Payment is not wired up: add Stripe (or another provider) inside `placeOrder` before going live.
- Seed images come from picsum.photos. Upload real images to a public `products` Storage bucket and put their URLs in `products.images`.
- Auth tables and the `profiles` trigger are in place; sign-in UI is not included.
