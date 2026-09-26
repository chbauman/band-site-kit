# @emeki/band-site-kit

Shared Next.js (App Router) components for small band websites: a gig
agenda backed by a public Google Sheet, a cover/hero section, a footer with
social links, and a section heading.

Ships compiled (`tsc` to `dist/*.js` + `.d.ts`) — install it like any other
npm package, no bundler configuration needed on the consumer side. Also
requires a Tailwind v4 `@source` directive so the consuming app's Tailwind
build picks up the package's utility classes (Tailwind doesn't scan
`node_modules` by default):

```css
/* app/globals.css */
@source "../../node_modules/@emeki/band-site-kit/dist";
```

## Theming

Components reference two Tailwind v4 theme tokens that the consuming app
must define in its own `globals.css`, so each site keeps its own brand
color/font without forking the components:

```css
@theme inline {
  --color-brand: var(--brand);
  --color-brand-dark: var(--brand-dark);
  --font-heading: var(--font-your-heading-font);
}
```

## Agenda

The gig list is meant to be fetched once at build time in an async Server
Component (so it's present in the static HTML / works with `output: export`),
then handed to a client provider that re-fetches on mount to stay live
between rebuilds:

```tsx
// app/page.tsx — Server Component, no "use client"
import { fetchAgenda, AgendaProvider, FutureEvents, PastEvents } from "@emeki/band-site-kit";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/.../pub?output=csv";

export default async function Home() {
  const agenda = await fetchAgenda(SHEET_URL);
  return (
    <AgendaProvider sheetId={SHEET_URL} initialData={agenda}>
      <FutureEvents />
      <PastEvents />
    </AgendaProvider>
  );
}
```

The sheet's columns are free-form except one rule: **the first column must
be a `DD.MM.YYYY` date**, used to sort into past/future. Every column
(including that first one) is read from the sheet's own header row and
rendered as-is, in whatever order and under whatever name the sheet uses —
e.g. `Datum | Ort | Was | Weiteres` works exactly like `Wann | Wo | Was`.
Any cell may contain a single Markdown-style link (`[text](https://...)`),
which renders as a real link.

## Cover

```tsx
import { Cover } from "@emeki/band-site-kit";

<Cover
  bandName="My Band"
  logoSrc="/logo.png"
  logoAlt="My Band logo"
  logoWidth={2584}
  logoHeight={1682}
  tagline="Optional tagline under the logo"
  backgroundImageSrc="/cover.jpg" // omit for a plain solid-color cover
  backgroundImageAlt="..."
  backgroundImageWidth={1750}
  backgroundImageHeight={667}
/>
```

## Footer

```tsx
import { Footer } from "@emeki/band-site-kit";

<Footer
  copyrightName="My Band"
  links={[
    { type: "email", href: "mailto:band@example.com" },
    { type: "instagram", href: "https://instagram.com/myband" },
    { type: "youtube", href: "https://youtube.com/@myband" },
  ]}
/>
```
