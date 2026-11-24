'use client';

import { useEffect, useRef } from 'react';
import Form from 'next/form';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

/**
 * The search box. next/form submits as a client-side navigation (no full page reload), so the
 * results skeleton can show immediately. The input is kept in sync with the URL, so clicking a
 * "Browse" link updates the text, while typing and focus are never interrupted.
 */
export default function SearchField({ initialQuery }: { initialQuery: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const q = useSearchParams().get('q') ?? initialQuery;

  useEffect(() => {
    const input = inputRef.current;
    if (input && document.activeElement !== input && input.value !== q) input.value = q;
  }, [q]);

  return (
    <Form action="/search" role="search" className="lg:max-w-3xl">
      <label htmlFor="search-query" className="mb-1 block text-xs text-neutral-500">
        Search for:
      </label>
      {/* No box or focus ring on the field itself: a hairline underline that darkens on focus. */}
      <div className="flex items-center border-b border-neutral-200 transition-colors focus-within:border-neutral-900">
        <input
          ref={inputRef}
          id="search-query"
          name="q"
          type="search"
          defaultValue={initialQuery}
          autoFocus={!initialQuery}
          autoComplete="off"
          placeholder="Name, description or category"
          className="min-w-0 flex-1 appearance-none rounded-none border-0 bg-transparent py-3 text-2xl font-light tracking-tight shadow-none outline-none ring-0 placeholder:text-neutral-300 focus:outline-none focus-visible:outline-none md:text-3xl"
        />
        <button
          type="submit"
          aria-label="Search"
          className="p-2 text-neutral-500 hover:text-neutral-900 focus-visible:text-neutral-900"
        >
          <Search size={22} strokeWidth={1.25} />
        </button>
      </div>
    </Form>
  );
}
