'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Minus, Plus } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/store/cart';
import { formatPrice } from '@/lib/format';

export default function ProductPurchase({ product }: { product: Product }) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const [color, setColor] = useState(product.colors[0]?.name ?? '');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  function buildItem() {
    if (product.sizes.length > 0 && !size) {
      setError('Select a size.');
      return null;
    }
    setError('');
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] ?? '',
      priceCents: product.price_cents,
      color,
      size,
      quantity,
    };
  }

  const addToCart = () => {
    const item = buildItem();
    if (item) add(item, true);
  };

  const buyNow = () => {
    const item = buildItem();
    if (!item) return;
    add(item, false);
    router.push('/checkout');
  };

  return (
    <div>
      <h1 className="text-2xl font-medium tracking-tight">{product.name}</h1>
      <p className="mt-2 text-lg">{formatPrice(product.price_cents)}</p>

      {product.colors.length > 0 && (
        <fieldset className="mt-8">
          <legend className="mb-3 text-sm">
            Color: <span className="text-neutral-500">{color}</span>
          </legend>
          <div className="flex gap-3">
            {product.colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColor(c.name)}
                aria-label={c.name}
                aria-pressed={color === c.name}
                style={{ backgroundColor: c.hex }}
                className={`h-8 w-8 rounded-full border border-neutral-300 ring-offset-2 ${
                  color === c.name ? 'ring-1 ring-neutral-900' : ''
                }`}
              />
            ))}
          </div>
        </fieldset>
      )}

      {product.sizes.length > 0 && (
        <fieldset className="mt-6">
          <legend className="mb-3 text-sm">Size</legend>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSize(s);
                  setError('');
                }}
                aria-pressed={size === s}
                className={`min-w-12 border px-3 py-2 text-sm ${
                  size === s
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-300 hover:border-neutral-900'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          {error && (
            <p role="alert" className="mt-2 text-sm text-red-600">
              {error}
            </p>
          )}
        </fieldset>
      )}

      <div className="mt-6">
        <p className="mb-3 text-sm">Quantity</p>
        <div className="inline-flex items-center border border-neutral-300">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-3"
          >
            <Minus size={14} />
          </button>
          <span className="w-10 text-center text-sm tabular-nums" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(20, q + 1))}
            className="p-3"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-3">
        <button type="button" onClick={buyNow} className="bg-neutral-900 py-3.5 text-sm text-white hover:bg-neutral-700">
          Buy now
        </button>
        <button
          type="button"
          onClick={addToCart}
          className="border border-neutral-900 py-3.5 text-sm hover:bg-neutral-900 hover:text-white"
        >
          Add to cart
        </button>
      </div>

      <div className="mt-10 border-t border-neutral-200 pt-6">
        <h2 className="mb-2 text-sm font-medium">Details</h2>
        <p className="max-w-prose whitespace-pre-line text-sm leading-relaxed text-neutral-600">
          {product.description}
        </p>
      </div>
    </div>
  );
}
