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
    phone: 'REPLACE_PHONE_NUMBER', // e.g. '+234 800 000 0000'
    email: 'REPLACE_EMAIL_ADDRESS', // e.g. 'hello@yourdomain.com'
    whatsapp: 'REPLACE_WHATSAPP_NUMBER', // international format, e.g. '+234 800 000 0000'
  },

  social: {
    instagram: 'REPLACE_INSTAGRAM_URL', // full URL, e.g. 'https://www.instagram.com/yourhandle'
    tiktok: 'REPLACE_TIKTOK_URL', // full URL, e.g. 'https://www.tiktok.com/@yourhandle'
  },

  availability: {
    days: 'Monday\u2013Saturday',
    hours: '9:00 a.m.\u20135:00 p.m.',
    timezone: 'WAT',
  },

  // Optional sentence shown above the questions in the FAQ modal. Leave '' to hide it.
  faqIntro: '',

  // Replace every question and answer below with your real FAQs. Add or remove items freely.
  faqs: [
    { question: 'REPLACE_FAQ_QUESTION_1', answer: 'REPLACE_FAQ_ANSWER_1' },
    { question: 'REPLACE_FAQ_QUESTION_2', answer: 'REPLACE_FAQ_ANSWER_2' },
    { question: 'REPLACE_FAQ_QUESTION_3', answer: 'REPLACE_FAQ_ANSWER_3' },
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
  closing: 'https://images.pexels.com/photos/5698851/pexels-photo-5698851.jpeg',
  categories: {
    tops: 'https://images.pexels.com/photos/6347888/pexels-photo-6347888.jpeg',
    bottoms: 'https://images.pexels.com/photos/31842963/pexels-photo-31842963.jpeg',
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
