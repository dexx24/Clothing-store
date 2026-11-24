'use client';

import { useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import ErrorView from '@/components/ErrorView';

// Catches errors thrown while rendering any page (database failures, missing env vars, bugs).
// The header and footer stay in place because this renders inside the root layout.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    console.error(error);
  }, [error]);

  // Server data errors need a refresh to re-run the server code; reset() alone only re-renders.
  const retry = () =>
    startTransition(() => {
      router.refresh();
      reset();
    });

  return <ErrorView message={error.message} digest={error.digest} onRetry={retry} busy={pending} />;
}
