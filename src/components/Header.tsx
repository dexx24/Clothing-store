import Link from 'next/link';
import { Search } from 'lucide-react';
import CartButton from './CartButton';
import ContactPanel from './ContactPanel';
import Logo from './Logo';
import MenuPanel from './MenuPanel';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/90 backdrop-blur">
      {/* Three-column grid: equal side columns keep the logo exactly centered at every width. */}
      <div className="mx-auto grid h-16 max-w-screen-2xl grid-cols-[1fr_auto_1fr] items-center px-4 md:h-20 md:px-8">
        <div className="flex items-center justify-start">
          <ContactPanel />
        </div>

        <Logo />

        <div className="flex items-center justify-end md:gap-2">
          <CartButton />
          <Link href="/search" className="flex items-center gap-2 p-2 text-sm font-medium hover:text-neutral-500">
            <Search size={20} strokeWidth={1.5} aria-hidden />
            <span className="sr-only">Search</span>
          </Link>
          <MenuPanel />
        </div>
      </div>
    </header>
  );
}
