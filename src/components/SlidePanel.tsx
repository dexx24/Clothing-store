'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useDialog } from '@/lib/useDialog';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  side?: 'left' | 'right';
  /** 'wide' covers half the screen on desktop; 'default' matches the cart (40%). Both are 90% on mobile. */
  size?: 'default' | 'wide';
  children: ReactNode;
}

function PanelBody({ onClose, title, side = 'right', size = 'default', children }: Omit<Props, 'open'>) {
  const ref = useRef<HTMLElement>(null);
  const titleId = useId();
  useDialog(ref, onClose);

  const offscreen = side === 'right' ? '100%' : '-100%';
  const width = size === 'wide' ? 'md:w-1/2' : 'md:w-[40%]';

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden
      />
      <motion.aside
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`fixed top-0 z-[70] h-dvh w-[90%] bg-white shadow-xl outline-none ${width} ${
          side === 'right' ? 'right-0' : 'left-0'
        }`}
        initial={{ x: offscreen }}
        animate={{ x: 0 }}
        exit={{ x: offscreen }}
        transition={{ type: 'tween', duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${title.toLowerCase()}`}
          className="absolute right-4 top-4 z-10 grid h-12 w-12 place-items-center rounded-full bg-neutral-900 text-white shadow-lg hover:bg-neutral-700 md:right-6 md:top-6"
        >
          <X size={20} strokeWidth={1.5} />
        </button>
        <div className="h-full overflow-y-auto px-6 pb-12 pt-24 md:px-16 md:pt-28">
          <h2 id={titleId} className="mb-10 text-3xl font-medium uppercase tracking-tight md:text-4xl">
            {title}
          </h2>
          {children}
        </div>
      </motion.aside>
    </>
  );
}

/**
 * Slide-in panel using the same interaction pattern as the cart drawer
 * (tween slide, dimmed backdrop, Escape / backdrop / close button to dismiss).
 * Rendered in a portal because the sticky header uses backdrop-filter, which would
 * otherwise become the containing block for `position: fixed` and clip the panel.
 */
export default function SlidePanel({ open, ...rest }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{open && <PanelBody key="panel" {...rest} />}</AnimatePresence>
    </MotionConfig>,
    document.body,
  );
}
