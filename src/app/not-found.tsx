import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="py-32 text-center">
      <h1 className="text-2xl font-medium">Page not found</h1>
      <Link href="/shop" className="mt-4 inline-block text-sm underline underline-offset-4">
        Back to shop
      </Link>
    </div>
  );
}
