const naira = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' });

export const formatPrice = (cents: number) => naira.format(cents / 100);
