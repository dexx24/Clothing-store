'use client';

import { ShoppingBag } from 'lucide-react';
import { selectCount, useCart } from '@/store/cart';

export default function CartButton() {
  const count = useCart(selectCount);
  const open = useCart((s) => s.open);

  return (
    <button
      type="button"
      onClick={open}
      aria-label={`Open cart, ${count} ${count === 1 ? 'item' : 'items'}`}
      className="relative -mr-2 p-2"
    >
      <ShoppingBag size={20} strokeWidth={1.5} />
      {count > 0 && (
        <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-neutral-900 px-1 text-[10px] font-medium text-white">
          {count}
        </span>
      )}
    </button>
  );
}
