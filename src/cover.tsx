"use client";

import Image from "next/image";

interface CoverProps {
  /** Used for the (visually hidden) page &lt;h1&gt; — real text for SEO/a11y,
   * since the band name is usually only shown as a logo image otherwise. */
  bandName: string;
  logoSrc: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  logoClassName?: string;
  /** Optional line shown under the logo, e.g. a tagline or genre. */
  tagline?: string;
  /** Full-bleed background photo. Omit for a plain solid-color cover
   * (just the logo, reserving `minHeightClassName` of vertical space). */
  backgroundImageSrc?: string;
  backgroundImageAlt?: string;
  backgroundImageWidth?: number;
  backgroundImageHeight?: number;
  /** Height reserved when there is no background image. */
  minHeightClassName?: string;
  /** Vertical position (as a % from the top) of the logo/tagline overlay.
   * Tune per photo so the text doesn't land awkwardly on a face. */
  overlayTopPercent?: number;
}

export function Cover({
  bandName,
  logoSrc,
  logoAlt,
  logoWidth,
  logoHeight,
  logoClassName = "w-32 md:w-80 xl:w-120 mb-3 mx-auto",
  tagline,
  backgroundImageSrc,
  backgroundImageAlt,
  backgroundImageWidth,
  backgroundImageHeight,
  minHeightClassName = "h-30 md:h-60 xl:h-110",
  overlayTopPercent = 50,
}: Readonly<CoverProps>) {
  return (
    <section className="relative w-full overflow-hidden bg-black">
      <div className="relative w-full">
        {backgroundImageSrc ? (
          <Image
            src={backgroundImageSrc}
            alt={backgroundImageAlt ?? ""}
            width={backgroundImageWidth}
            height={backgroundImageHeight}
            priority
            className="w-full h-auto object-contain"
          />
        ) : (
          <div className={`${minHeightClassName} mx-auto`} />
        )}
        <div className="absolute inset-0 bg-black/50 dark:bg-black/60" />

        <div
          className="absolute inset-x-0 z-10 px-4"
          style={{ top: `${overlayTopPercent}%` }}
        >
          <div className="max-w-6xl mx-auto text-center text-white -translate-y-1/2">
            <h1 className="sr-only">{bandName}</h1>
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={logoWidth}
              height={logoHeight}
              priority
              className={logoClassName}
            />
            {tagline && (
              <p className="font-heading sm:text-xl md:text-2xl xl:text-4xl font-bold drop-shadow">
                {tagline}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
