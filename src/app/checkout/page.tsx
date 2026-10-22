import type { Metadata } from 'next';
import CheckoutForm from '@/components/CheckoutForm';

export const metadata: Metadata = { title: 'Checkout' };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-10 md:px-8">
      <h1 className="mb-8 text-3xl font-medium tracking-tight">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
