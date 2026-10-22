'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import SlidePanel from './SlidePanel';
import { navigation } from '@/config/site';

export default function MenuPanel() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex items-center gap-2 p-2 text-sm hover:text-neutral-500"
      >
        <Menu size={20} strokeWidth={1.5} aria-hidden />
        <span className="sr-only md:not-sr-only">Menu</span>
      </button>

      <SlidePanel open={open} onClose={close} title="Menu" side="left">
        <nav aria-label="Menu">
          <ul className="flex flex-col gap-1">
            {navigation.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={close}
                  className="block py-2 text-2xl font-medium tracking-tight hover:text-neutral-500"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/shop"
            onClick={close}
            className="mt-8 inline-block text-sm underline underline-offset-4 hover:text-neutral-500"
          >
            Shop all
          </Link>
        </nav>
      </SlidePanel>
    </>
  );
}
