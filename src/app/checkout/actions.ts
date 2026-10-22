'use server';

import { supabase } from '@/lib/supabase';

export interface OrderInput {
  email: string;
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  items: { productId: string; quantity: number; color: string; size: string }[];
}

export async function placeOrder(input: OrderInput): Promise<{ orderId?: string; error?: string }> {
  const required = [input.email, input.fullName, input.address, input.city, input.postalCode, input.country];
  if (required.some((v) => !v?.trim())) return { error: 'Please fill in all fields.' };
  if (!/^\S+@\S+\.\S+$/.test(input.email)) return { error: 'Enter a valid email address.' };
  if (!input.items.length) return { error: 'Your cart is empty.' };

  // Prices are re-read from the database inside create_order(), never trusted from the client.
  const { data, error } = await supabase.rpc('create_order', {
    p_email: input.email.trim(),
    p_full_name: input.fullName.trim(),
    p_shipping: {
      address: input.address.trim(),
      city: input.city.trim(),
      postal_code: input.postalCode.trim(),
      country: input.country.trim(),
    },
    p_items: input.items.map((i) => ({
      product_id: i.productId,
      quantity: i.quantity,
      color: i.color,
      size: i.size,
    })),
  });

  if (error) return { error: 'We could not place your order. Please try again.' };
  return { orderId: data as string };
}
