import { isPlaceholder, siteConfig } from '@/config/site';

export interface ContactItem {
  key: 'phone' | 'email' | 'whatsapp' | 'instagram' | 'tiktok';
  label: string;
  value: string;
  /** null while the value is still a placeholder, so we never render a broken link. */
  href: string | null;
  external: boolean;
}

const stripProtocol = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

export function getContactItems(): ContactItem[] {
  const { contact, social } = siteConfig;
  const phoneSet = !isPlaceholder(contact.phone);
  const emailSet = !isPlaceholder(contact.email);
  const whatsappSet = !isPlaceholder(contact.whatsapp);
  const instagramSet = !isPlaceholder(social.instagram);
  const tiktokSet = !isPlaceholder(social.tiktok);

  return [
    {
      key: 'phone',
      label: 'Phone',
      value: contact.phone,
      href: phoneSet ? `tel:${contact.phone.replace(/[^\d+]/g, '')}` : null,
      external: false,
    },
    {
      key: 'email',
      label: 'Email',
      value: contact.email,
      href: emailSet ? `mailto:${contact.email}` : null,
      external: false,
    },
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      value: contact.whatsapp,
      href: whatsappSet ? `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}` : null,
      external: true,
    },
    {
      key: 'instagram',
      label: 'Instagram',
      value: instagramSet ? stripProtocol(social.instagram) : social.instagram,
      href: instagramSet ? social.instagram : null,
      external: true,
    },
    {
      key: 'tiktok',
      label: 'TikTok',
      value: tiktokSet ? stripProtocol(social.tiktok) : social.tiktok,
      href: tiktokSet ? social.tiktok : null,
      external: true,
    },
  ];
}
