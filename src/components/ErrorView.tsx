'use client';

interface Props {
  /** Error text, only shown while developing. Production errors are redacted by Next.js anyway. */
  message?: string;
  /** Error reference from Next.js, handy to quote to support or find in server logs. */
  digest?: string;
  onRetry: () => void;
  busy?: boolean;
}

/** Shared error screen used by app/error.tsx and app/global-error.tsx. Uses plain <a> links so it works anywhere. */
export default function ErrorView({ message, digest, onRetry, busy = false }: Props) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 py-24 text-center">
      <div role="alert">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">Something went wrong</p>
        <h1 className="mt-4 text-3xl font-light tracking-tight md:text-4xl">We couldn&apos;t load this page</h1>
        <p className="mt-4 font-light text-neutral-600">
          This is usually temporary. Please try again, or head back to the shop.
        </p>
      </div>

      {process.env.NODE_ENV === 'development' && message && (
        <pre className="mt-6 max-w-full overflow-x-auto bg-neutral-100 p-3 text-left text-xs text-neutral-700">
          {message}
        </pre>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          disabled={busy}
          className="bg-neutral-900 px-6 py-3 text-sm text-white hover:bg-neutral-700 disabled:opacity-50"
        >
          {busy ? 'Trying again...' : 'Try again'}
        </button>
        <a
          href="/shop"
          className="border border-neutral-900 px-6 py-3 text-sm hover:bg-neutral-900 hover:text-white"
        >
          Browse the shop
        </a>
      </div>

      {digest && <p className="mt-10 text-xs text-neutral-400">Reference: {digest}</p>}
    </div>
  );
}
