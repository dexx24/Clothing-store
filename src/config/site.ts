/**
 * Single place to edit store details.
 *
 * Any value that starts with "REPLACE_" is a placeholder. Placeholders are shown as plain,
 * greyed-out text (never as links) until you replace them with real values.
 */

export const PLACEHOLDER_PREFIX = 'REPLACE_';
export const isPlaceholder = (value: string) => value.startsWith(PLACEHOLDER_PREFIX);

export const siteConfig = {
  name: 'Nove',

  contact: {
    phone: '+2349029955629', // e.g. '+234 800 000 0000'
    email: 'adediyadavid@gmail.com', // e.g. 'hello@yourdomain.com'
    whatsapp: '+2349029955629', // international format, e.g. '+234 800 000 0000'
  },

  social: {
    instagram: 'INSTAGRAM', // full URL, e.g. 'https://www.instagram.com/yourhandle'
    tiktok: 'TIKTOK', // full URL, e.g. 'https://www.tiktok.com/@yourhandle'
  },

  availability: {
    days: 'Monday\u2013Saturday',
    hours: '9:00 a.m.\u20135:00 p.m.',
    timezone: 'WAT',
  },

  // Who built the site. Shown in the FAQ and the Contact panel so visitors know who to ask about getting a site like this.
  builder: { name: 'David' },

  // Optional sentence shown above the questions in the FAQ modal. Leave '' to hide it.
  faqIntro: '',

  // Add your store's own questions (shipping, returns, sizing...) here with your real answers.
  faqs: [
    {
      question: 'Who built this website?',
      answer: 'This website was designed and built by David.',
    },
    {
      question: 'Interested in a website like this? How can I reach you?',
      answer:
        'Open the Contact us panel at the top of the page and reach David by phone, email, WhatsApp. Tell him about your brand and he will get back to you.',
    },
  ],
} as const;

/**
 * Homepage background images. Put your own files in /public/images with these exact names.
 * If a file is missing, the matching placeholder photo below is used instead, so nothing breaks.
 * (Hero falls back to the featured product image.)
 */
export const homeImages = {
  hero: '/images/home-hero.jpg', // top of the homepage
  closing: '/images/home-closing.jpg', // "Find your next favorite." banner
  // Category tile backgrounds, keyed by category slug. Categories not listed here stay plain.
  categories: {
    tops: '/images/category-tops.jpg',
    bottoms: '/images/category-bottoms.jpg',
  } as Record<string, string>,
} as const;

/** Stock placeholders (picsum.photos). Delete or replace once you add your own photos. */
export const placeholderImages = {
  closing: 'https://picsum.photos/seed/nove-closing/2400/1400',
  categories: {
    tops: 'https://picsum.photos/seed/nove-tops/1200/800',
    bottoms: 'https://picsum.photos/seed/nove-bottoms/1200/800',
  } as Record<string, string>,
} as const;

/**
 * Category slugs must match `categories.slug` in Supabase.
 * `supabase/add-categories.sql` creates the ones missing from the original seed.
 */
export const shopCategories = [
  { slug: 'tops', name: 'Tops' },
  { slug: 'bottoms', name: 'Bottoms' },
  { slug: 'hoodies', name: 'Hoodies' },
  { slug: 'sweats', name: 'Sweats' },
  { slug: 'plain-tees', name: 'Plain Tees' },
] as const;

/** Links used by the menu panel and the footer. All point at the existing /shop route. */
export const navigation = [
  { label: 'Women', href: '/shop?gender=women' },
  { label: 'Men', href: '/shop?gender=men' },
  { label: 'Sweats', href: '/shop?category=sweats' },
  { label: 'Hoodies', href: '/shop?category=hoodies' },
  { label: 'Plain Tees', href: '/shop?category=plain-tees' },
] as const;
