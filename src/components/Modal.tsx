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
  children: ReactNode;
}

function ModalBody({ onClose, title, children }: Omit<Props, 'open'>) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialog(ref, onClose);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden
      />
      <div className="pointer-events-none fixed inset-0 z-[70] grid place-items-center p-4">
        <motion.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className="pointer-events-auto flex max-h-[85dvh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white text-neutral-900 shadow-2xl outline-none"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-6 py-5 md:px-10 md:py-6">
            <h2 id={titleId} className="text-2xl tracking-tight md:text-3xl">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={`Close ${title}`}
              className="grid h-12 w-12 place-items-center rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-100"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>
          <div className="overflow-y-auto px-6 py-6 md:px-10">{children}</div>
        </motion.div>
      </div>
    </>
  );
}

/** Centered modal dialog. Portaled to <body> so it isn't clipped by any ancestor. */
export default function Modal({ open, onClose, title, children }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <ModalBody key="modal" onClose={onClose} title={title}>
            {children}
          </ModalBody>
        )}
      </AnimatePresence>
    </MotionConfig>,
    document.body,
  );
}
