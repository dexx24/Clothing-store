'use client';

import { useEffect, useState, useTransition, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { selectSubtotal, useCart } from '@/store/cart';
import { formatPrice } from '@/lib/format';
import { placeOrder } from '@/app/checkout/actions';

const FIELDS = [
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'fullName', label: 'Full name', type: 'text', autoComplete: 'name' },
  { name: 'address', label: 'Address', type: 'text', autoComplete: 'street-address' },
  { name: 'city', label: 'City', type: 'text', autoComplete: 'address-level2' },
  { name: 'postalCode', label: 'Postal code', type: 'text', autoComplete: 'postal-code' },
  { name: 'country', label: 'Country', type: 'text', autoComplete: 'country-name' },
] as const;

export default function CheckoutForm() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const subtotal = useCart(selectSubtotal);
  const clear = useCart((s) => s.clear);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    Promise.resolve(useCart.persist.rehydrate()).then(() => setReady(true));
  }, []);

  if (!ready) return <div className="h-96" aria-busy />;

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="mb-4 text-sm text-neutral-500">Your cart is empty.</p>
        <Link href="/shop" className="text-sm underline underline-offset-4">
          Continue shopping
        </Link>
      </div>
    );
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? '');

    startTransition(async () => {
      const res = await placeOrder({
        email: get('email'),
        fullName: get('fullName'),
        address: get('address'),
        city: get('city'),
        postalCode: get('postalCode'),
        country: get('country'),
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          color: i.color,
          size: i.size,
        })),
      });
      if (res.error || !res.orderId) {
        setError(res.error ?? 'Something went wrong.');
        return;
      }
      clear();
      router.push(`/checkout/success?order=${res.orderId}`);
    });
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
      <form onSubmit={onSubmit} className="grid gap-5">
        <h2 className="text-lg font-medium">Contact and delivery</h2>
        {FIELDS.map((field) => (
          <label key={field.name} className="grid gap-1.5 text-sm">
            {field.label}
            <input
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              required
              className="border border-neutral-300 px-3 py-3 outline-none focus:border-neutral-900"
            />
          </label>
        ))}
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="mt-2 bg-neutral-900 py-3.5 text-sm text-white hover:bg-neutral-700 disabled:opacity-50"
        >
          {pending ? 'Placing order...' : `Place order, ${formatPrice(subtotal)}`}
        </button>
      </form>

      <aside aria-label="Order summary" className="h-fit bg-neutral-50 p-6">
        <h2 className="mb-4 text-lg font-medium">Order summary</h2>
        <ul className="divide-y divide-neutral-200">
          {items.map((item) => (
            <li key={item.key} className="flex gap-4 py-4 text-sm">
              <div className="relative aspect-[4/5] w-16 shrink-0 bg-neutral-200">
                <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-neutral-500">
                  {[item.color, item.size].filter(Boolean).join(' / ')} &times; {item.quantity}
                </p>
              </div>
              <p className="tabular-nums">{formatPrice(item.priceCents * item.quantity)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 text-sm font-medium">
          <span>Subtotal</span>
          <span className="tabular-nums">{formatPrice(subtotal)}</span>
        </div>
      </aside>
    </div>
  );
}
