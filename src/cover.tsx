"use client";

import Image from "next/image";

interface CoverProps {
  /** The band's name. Used for the page &lt;h1&gt; — either visible (see
   * `showTitle`) or screen-reader-only when a logo image carries the name
   * visually instead. */
  bandName: string;
  /** Optional wordmark/logo image. Omit for a text-only hero (`showTitle`). */
  logoSrc?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  logoClassName?: string;
  /** Optional line shown under the logo/title, e.g. a tagline or genre. */
  tagline?: string;
  /** Full-bleed background photo. Omit for a plain solid-color cover
   * (reserving `minHeightClassName` of vertical space). */
  backgroundImageSrc?: string;
  backgroundImageAlt?: string;
  backgroundImageWidth?: number;
  backgroundImageHeight?: number;
  /** Height reserved when there is no background image. */
  minHeightClassName?: string;
  /** Vertical position (as a % from the top) of the overlay content.
   * Tune per photo so the text doesn't land awkwardly on a face. */
  overlayTopPercent?: number;
  /** Render `bandName` as a visible heading instead of screen-reader-only
   * text — for bands whose hero relies on a text title rather than a
   * wordmark logo image. */
  showTitle?: boolean;
  /** Extra classes for a full-width background panel (edge-to-edge, behind
   * the title/tagline text), e.g. `"bg-white/50 py-8"` for a semi-transparent
   * band so text stays legible over a busy photo. Empty by default (no
   * panel). */
  textPanelClassName?: string;
  /** Text color for the title/tagline block. Defaults to white, which
   * assumes the dark image overlay below; override for a light panel. */
  textColorClassName?: string;
  /** Extra classes for the full-image tint. Defaults to a dark overlay;
   * override (e.g. lighter, or "") when a `textPanelClassName` panel is
   * doing the contrast work instead. */
  imageOverlayClassName?: string;
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
  showTitle = false,
  textPanelClassName = "",
  textColorClassName = "text-white",
  imageOverlayClassName = "bg-black/50 dark:bg-black/60",
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
        {imageOverlayClassName && (
          <div className={`absolute inset-0 ${imageOverlayClassName}`} />
        )}

        <div
          className="absolute inset-x-0 z-10"
          style={{ top: `${overlayTopPercent}%` }}
        >
          <div className={`-translate-y-1/2 ${textPanelClassName}`}>
            <div
              className={`max-w-6xl mx-auto px-4 text-center ${textColorClassName}`}
            >
              {showTitle ? (
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold">
                  {bandName}
                </h1>
              ) : (
                <h1 className="sr-only">{bandName}</h1>
              )}
              {logoSrc && (
                <Image
                  src={logoSrc}
                  alt={logoAlt ?? bandName}
                  width={logoWidth}
                  height={logoHeight}
                  priority
                  className={logoClassName}
                />
              )}
              {tagline && (
                <p className="font-heading sm:text-xl md:text-2xl xl:text-4xl font-bold drop-shadow">
                  {tagline}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
