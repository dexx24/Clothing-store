import Link from "next/link";
import Image from "next/image";
import HeaderLogo from "@/public/jk-dressmelogodark.png";
import FooterLogo from "@/public/jk-dressmelogo.png";

interface Props {
  className?: string;
  location?: "header" | "footer";
}

// Header and footer share this component so the logo only lives in one place.
export default function Logo({
  className = "block",
  location = "header",
}: Props) {
  const isHeader = location === "header";

  return (
    <Link href="/" className={className}>
      <Image
        src={isHeader ? HeaderLogo : FooterLogo}
        alt="Jk_DressMe"
        priority={isHeader}
        sizes={
          isHeader
            ? "(min-width: 1024px) 240px, (min-width: 768px) 200px, 28vw"
            : "(min-width: 768px) 448px, 320px"
        }
        // Header: sized by HEIGHT (32px phone, 40px, 48px, 56px desktop) to fit the 64px / 80px bar.
        // max-w keeps it clear of the Contact and cart/search/menu icons on narrow phones.
        // Footer: fills its column up to a moderate maximum (320px, 384px, 448px).
        className={
          isHeader
            ? "h-8 w-auto max-w-[28vw] object-contain sm:h-10 sm:max-w-none md:h-12 lg:h-14"
            : "h-auto w-full max-w-xs sm:max-w-sm md:max-w-md"
        }
      />
    </Link>
  );
}
