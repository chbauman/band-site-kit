"use client";

import Image from "next/image";
import {
  FaBandcamp,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";

const ICONS = {
  email: FaEnvelope,
  instagram: FaInstagram,
  youtube: FaYoutube,
  facebook: FaFacebook,
  tiktok: FaTiktok,
  bandcamp: FaBandcamp,
} as const;

const DEFAULT_LABELS: Record<SocialType, string> = {
  email: "Email",
  instagram: "Instagram",
  youtube: "YouTube",
  facebook: "Facebook",
  tiktok: "TikTok",
  bandcamp: "Bandcamp",
};

export type SocialType = keyof typeof ICONS;

export interface SocialLink {
  type: SocialType;
  href: string;
  /** Overrides the default accessible label (e.g. "Instagram"). */
  label?: string;
}

interface FooterProps {
  /** Shown as "© <year> <copyrightName>". */
  copyrightName: string;
  links: readonly SocialLink[];
  logoSrc?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
}

export function Footer({
  copyrightName,
  links,
  logoSrc,
  logoAlt,
  logoWidth = 77,
  logoHeight = 50,
}: Readonly<FooterProps>) {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300">
      <div className="max-w-5xl px-4 mx-auto py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-m">
          © {new Date().getFullYear()} {copyrightName}
        </p>
        {logoSrc && (
          <Image
            src={logoSrc}
            alt={logoAlt ?? copyrightName}
            width={logoWidth}
            height={logoHeight}
            style={{ height: `${logoHeight}px`, width: "auto" }}
          />
        )}
        <div className="flex space-x-6">
          {links.map(({ type, href, label }) => {
            const Icon = ICONS[type];
            const external = !href.startsWith("mailto:");
            return (
              <a
                key={type + href}
                href={href}
                aria-label={label ?? DEFAULT_LABELS[type]}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="hover:text-brand transition-colors"
              >
                <Icon size={20} />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
