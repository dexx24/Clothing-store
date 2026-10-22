import type { Metadata } from 'next';
import { Hanken_Grotesk } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import HideOnSearch from '@/components/HideOnSearch';
import './globals.css';

const sans = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Nove', template: '%s | Nove' },
  description: 'Considered everyday clothing: tops and bottoms in honest fabrics.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body className="font-sans">
        <HideOnSearch>
          <Header />
        </HideOnSearch>
        <main className="min-h-[70vh]">{children}</main>
        <HideOnSearch>
          <Footer />
        </HideOnSearch>
        <CartDrawer />
      </body>
    </html>
  );
}
