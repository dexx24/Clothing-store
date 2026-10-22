'use client';

import { useCallback, useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Modal from './Modal';
import { siteConfig } from '@/config/site';

function FaqList() {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {siteConfig.faqIntro && <p className="mb-6 leading-relaxed text-neutral-600">{siteConfig.faqIntro}</p>}
      <div className="space-y-3">
        {siteConfig.faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          const buttonId = `${baseId}-q${i}`;
          const panelId = `${baseId}-a${i}`;
          return (
            <div key={faq.question} className="overflow-hidden rounded-xl border border-neutral-200">
              <h3>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base"
                >
                  {faq.question}
                  <ChevronDown
                    size={18}
                    aria-hidden
                    className={`shrink-0 text-neutral-500 transition-transform motion-reduce:transition-none ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className="border-t border-neutral-200 bg-neutral-50 px-5 py-4 leading-relaxed text-neutral-600"
              >
                {faq.answer}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function FaqModal() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="text-left hover:text-white"
      >
        FAQ
      </button>
      <Modal open={open} onClose={close} title="FAQs">
        <FaqList />
      </Modal>
    </>
  );
}
