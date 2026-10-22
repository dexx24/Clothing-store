"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import Link from "next/link";

// Inline chevrons (same paths as lucide's ChevronLeft/ChevronRight). Importing lucide-react icons in
// this file made `next build` fail with "Could not find the module ... in the React Client Manifest".
function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

interface Props {
  title: string;
  viewAllHref: string;
  /** <li> items. Each should set its own width, e.g. via CAROUSEL_ITEM_CLASS from '@/lib/carousel'. */
  children: ReactNode;
}

/**
 * Horizontally scrolling product row. Touch: native swipe with scroll-snap.
 * Keyboard: focus the row and use Left/Right/Home/End, or use the Previous/Next buttons.
 * Cards are server-rendered and passed in as children, so this stays a tiny client component.
 */
export default function ProductCarousel({
  title,
  viewAllHref,
  children,
}: Props) {
  const headingId = useId();
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    const el = trackRef.current;
    if (!el) return;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [update]);

  const behavior = (): ScrollBehavior =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";

  const page = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (el)
      el.scrollBy({
        left: direction * el.clientWidth * 0.9,
        behavior: behavior(),
      });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const el = trackRef.current;
    if (!el) return;
    if (e.key === "ArrowRight") page(1);
    else if (e.key === "ArrowLeft") page(-1);
    else if (e.key === "Home") el.scrollTo({ left: 0, behavior: behavior() });
    else if (e.key === "End")
      el.scrollTo({ left: el.scrollWidth, behavior: behavior() });
    else return;
    e.preventDefault();
  };

  // Frosted-glass arrows centred on the product images. At rest they are soft (blurred, faded);
  // they sharpen when the pointer is over the carousel or when an arrow/the row has keyboard focus.
  const arrowBase =
    "absolute top-[44%] z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-white/80 text-neutral-900 shadow-lg backdrop-blur-md transition duration-300 motion-reduce:transition-none md:h-12 md:w-12";
  const arrowIdle =
    "opacity-80 blur-[1px] group-hover:opacity-100 group-hover:blur-none group-focus-within:opacity-100 group-focus-within:blur-none";
  const arrowHidden = "pointer-events-none opacity-0";

  return (
    <section
      aria-labelledby={headingId}
      aria-roledescription="carousel"
      className="mt-24"
    >
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h2 id={headingId} className="text-lg font-medium tracking-tight">
          {title}
        </h2>
        <Link
          href={viewAllHref}
          className="text-sm underline underline-offset-4"
        >
          View all
        </Link>
      </div>

      <div className="group relative">
        <button
          type="button"
          onClick={() => page(-1)}
          disabled={!canPrev}
          aria-label={`Previous ${title}`}
          className={`${arrowBase} left-2 md:left-3 lg:left-4 ${canPrev ? arrowIdle : arrowHidden}`}
        >
          <Chevron direction="left" />
        </button>
        <button
          type="button"
          onClick={() => page(1)}
          disabled={!canNext}
          aria-label={`Next ${title}`}
          className={`${arrowBase} right-2 md:right-3 lg:right-4 ${canNext ? arrowIdle : arrowHidden}`}
        >
          <Chevron direction="right" />
        </button>

        <ul
          ref={trackRef}
          tabIndex={0}
          aria-label={`${title}, use left and right arrow keys to scroll`}
          onScroll={update}
          onKeyDown={onKeyDown}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden"
        >
          {children}
        </ul>
      </div>
    </section>
  );
}
