'use client';

import { useEffect } from 'react';
import ErrorView from '@/components/ErrorView';
import './globals.css';

// Last resort: catches errors in the root layout itself (header, footer, fonts), which
// app/error.tsx cannot. It replaces the whole page, so it must render its own <html> and <body>.
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-white text-neutral-900">
        <ErrorView message={error.message} digest={error.digest} onRetry={() => window.location.reload()} />
      </body>
    </html>
  );
}
