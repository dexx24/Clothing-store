import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Order placed' };

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-3xl font-medium tracking-tight">Thank you for your order.</h1>
      {order && <p className="mt-3 text-sm text-neutral-500">Order reference: {order.slice(0, 8)}</p>}
      <Link href="/shop" className="mt-8 inline-block bg-neutral-900 px-6 py-3 text-sm text-white hover:bg-neutral-700">
        Continue shopping
      </Link>
    </div>
  );
}
