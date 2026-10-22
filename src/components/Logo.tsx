import Link from 'next/link';
import { siteConfig } from '@/config/site';

// The existing wordmark, unchanged. Header and footer share it so it only lives in one place.
export default function Logo({ className = 'text-lg font-semibold tracking-tight' }: { className?: string }) {
  return (
    <Link href="/" className={className}>
      {siteConfig.name}
    </Link>
  );
}
