'use client';

import { useCallback, useState } from 'react';
import { Instagram, Mail, MessageCircle, Music2, Phone, Plus, type LucideIcon } from 'lucide-react';
import SlidePanel from './SlidePanel';
import { siteConfig } from '@/config/site';
import { getContactItems, type ContactItem } from '@/lib/contact';

const ICONS: Record<ContactItem['key'], LucideIcon> = {
  phone: Phone,
  email: Mail,
  whatsapp: MessageCircle,
  instagram: Instagram,
  tiktok: Music2,
};

export default function ContactPanel() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const items = getContactItems();
  const { days, hours, timezone } = siteConfig.availability;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="-ml-2 flex items-center gap-2 p-2 text-sm font-medium hover:text-neutral-500"
      >
        <Plus size={18} strokeWidth={1.75} aria-hidden />
        <span className="sr-only sm:not-sr-only">Contact us</span>
      </button>

      <SlidePanel open={open} onClose={close} title="Contact us" side="right" size="wide">
        <ul className="space-y-8">
          {items.map((item) => {
            const Icon = ICONS[item.key];
            const hasHours = item.key === 'phone' || item.key === 'whatsapp';
            return (
              <li key={item.key}>
                <div className="flex items-center gap-3">
                  <Icon size={18} strokeWidth={1.5} aria-hidden className="shrink-0" />
                  <span className="sr-only">{item.label}: </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="break-all text-lg underline underline-offset-4 hover:text-neutral-500"
                    >
                      {item.key === 'phone' || item.key === 'whatsapp' ? `${item.label} ${item.value}` : item.value}
                    </a>
                  ) : (
                    <span className="break-all text-lg text-neutral-400">
                      {item.label}: {item.value}
                    </span>
                  )}
                </div>
                {hasHours && (
                  <p className="mt-3 pl-[30px] text-neutral-600">
                    {days}
                    <br />
                    {hours} {timezone}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </SlidePanel>
    </>
  );
}
