'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/** The search page is a full-screen view with its own logo bar, so the site header and footer step aside. */
export default function HideOnSearch({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return pathname === '/search' ? null : <>{children}</>;
}
