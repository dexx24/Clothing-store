'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { Minus, Plus, X } from 'lucide-react';
import { selectCount, selectSubtotal, useCart } from '@/store/cart';
import { formatPrice } from '@/lib/format';

export default function CartDrawer() {
  const items = useCart((s) => s.items);
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const remove = useCart((s) => s.remove);
  const setQuantity = useCart((s) => s.setQuantity);
  const subtotal = useCart(selectSubtotal);
  const count = useCart(selectCount);

  useEffect(() => {
    void useCart.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    const prevOverflow = document.body.style.overflow;
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close]);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-40 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-hidden
          />
        )}
        {isOpen && (
          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="fixed right-0 top-0 z-50 flex h-dvh w-[90%] flex-col bg-white shadow-xl md:w-[40%]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="flex h-14 items-center justify-between border-b border-neutral-200 px-5">
              <h2 className="text-sm font-medium">Cart ({count})</h2>
              <button type="button" onClick={close} aria-label="Close cart" className="-mr-2 p-2">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 text-center">
                <p className="text-sm text-neutral-500">Your cart is empty.</p>
                <Link href="/shop" onClick={close} className="text-sm underline underline-offset-4">
                  Continue shopping
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-neutral-200 overflow-y-auto px-5">
                  {items.map((item) => (
                    <li key={item.key} className="flex gap-4 py-5">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={close}
                        className="relative aspect-[4/5] w-20 shrink-0 bg-neutral-100"
                      >
                        <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                      </Link>
                      <div className="flex flex-1 flex-col text-sm">
                        <div className="flex justify-between gap-2">
                          <p className="font-medium">{item.name}</p>
                          <button
                            type="button"
                            onClick={() => remove(item.key)}
                            aria-label={`Remove ${item.name}`}
                            className="-mr-1 -mt-1 p-1 text-neutral-400 hover:text-neutral-900"
                          >
                            <X size={16} strokeWidth={1.5} />
                          </button>
                        </div>
                        <p className="text-neutral-500">{[item.color, item.size].filter(Boolean).join(' / ')}</p>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center border border-neutral-300">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() => setQuantity(item.key, item.quantity - 1)}
                              className="p-1.5"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-7 text-center tabular-nums">{item.quantity}</span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() => setQuantity(item.key, item.quantity + 1)}
                              className="p-1.5"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <p className="tabular-nums">{formatPrice(item.priceCents * item.quantity)}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-neutral-200 p-5">
                  <div className="mb-1 flex justify-between text-sm font-medium">
                    <span>Subtotal</span>
                    <span className="tabular-nums">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mb-4 text-xs text-neutral-500">Shipping calculated at checkout.</p>
                  <Link
                    href="/checkout"
                    onClick={close}
                    className="block w-full bg-neutral-900 py-3.5 text-center text-sm text-white hover:bg-neutral-700"
                  >
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
