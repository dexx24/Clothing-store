/**
 * Shared item sizing for ProductCarousel: ~1.5 cards on phones, 2.4 on tablets, 3.3 on desktop
 * (a peek of the next card). Lives outside the 'use client' component file so server components
 * can import this value safely.
 */
export const CAROUSEL_ITEM_CLASS =
  'shrink-0 snap-start basis-[66%] sm:basis-[42%] lg:basis-[calc((100%-2rem)/3.3)]';
