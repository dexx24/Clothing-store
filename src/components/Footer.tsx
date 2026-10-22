import Link from "next/link";
import FaqModal from "./FaqModal";
import Logo from "./Logo";
import { navigation, siteConfig } from "@/config/site";
import { getContactItems } from "@/lib/contact";

export default function Footer() {
  const socials = getContactItems().filter((i) =>
    ["instagram", "tiktok", "whatsapp"].includes(i.key),
  );

  return (
    <footer className="mt-24 overflow-hidden bg-neutral-900 text-neutral-400">
      <div className="mx-auto max-w-screen-2xl px-4 pt-16 md:px-8">
        <div className="grid gap-12 text-sm sm:grid-cols-3">
          <nav aria-labelledby="footer-shop">
            <h2 id="footer-shop" className="mb-4 text-white">
              Shop
            </h2>
            <ul className="space-y-2">
              {navigation.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/shop" className="hover:text-white">
                  Shop all
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="mb-4 text-white">Help</h2>
            <ul className="space-y-2">
              <li>
                <FaqModal />
              </li>
              <li>
                <Link href="/search" className="hover:text-white">
                  Search
                </Link>
              </li>
            </ul>
          </div>

          <nav aria-labelledby="footer-follow">
            <h2 id="footer-follow" className="mb-4 text-white">
              Follow
            </h2>
            <ul className="space-y-2">
              {socials.map((s) => (
                <li key={s.key}>
                  {s.href ? (
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white"
                    >
                      {s.label}
                    </a>
                  ) : (
                    <span className="text-neutral-600">{s.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Logo className="mt-20 block text-[clamp(6rem,30vw,26rem)] font-semibold leading-[0.8] tracking-tighter text-white" />

        <p className="py-8 text-xs">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
