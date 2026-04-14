import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Barlow, Barlow_Condensed, Teko, IBM_Plex_Mono, Noto_Sans_Arabic } from 'next/font/google'
import '@/styles/globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://atlaskings.com'

/* ── Self-hosted fonts via next/font (no render-blocking @import) ── */
const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--nf-body',
})

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--nf-head',
})

const teko = Teko({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
  variable: '--nf-logo',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--nf-mono',
})

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--nf-arabic',
})

const fontVariables = [
  barlow.variable,
  barlowCondensed.variable,
  teko.variable,
  ibmPlexMono.variable,
  notoSansArabic.variable,
].join(' ')

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a5229',
}

export const metadata: Metadata = {
  title: {
    default: 'Atlas Kings — Football for Morocco & the MENA Region',
    template: '%s — Atlas Kings',
  },
  description: 'Independent football news, live scores, fixtures and standings covering Morocco, Botola Pro, Premier League, Champions League and the 2030 World Cup.',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: 'Atlas Kings',
    type: 'website',
    images: [{ url: '/images/og-default.jpg', width: 1200, height: 630, alt: 'Atlas Kings' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@atlaskingsfootball',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // SSR-safe defaults. The inline script below overrides lang/dir
    // pre-paint from the atlas-lang cookie when present, so users who
    // previously chose AR or FR see the correct direction immediately
    // on navigation. Static defaults on the tag itself prevent a
    // hydration mismatch flash on the very first render.
    <html lang="en" dir="ltr" suppressHydrationWarning className={fontVariables}>
      <head>
        {/* Set lang/dir before paint to avoid flash — overridden by [lang] layout */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var c=document.cookie.match(/atlas-lang=([^;]+)/);
            var l=c?c[1]:'en';
            document.documentElement.lang=l;
            document.documentElement.dir=l==='ar'?'rtl':'ltr';
          })();
        `}} />
        <meta name="publisher" content="Atlas Kings" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" href="/images/icon-192.png" />
        <link rel="apple-touch-icon" href="/images/icon-192.png" />
        {/* RSS autodiscovery */}
        <link rel="alternate" type="application/rss+xml" title="Atlas Kings — English" href="/api/rss" />
        <link rel="alternate" type="application/rss+xml" title="أطلس كينغز — العربية" href="/api/rss?lang=ar" />
        <link rel="alternate" type="application/rss+xml" title="Atlas Kings — Français" href="/api/rss?lang=fr" />
        {/* JSON-LD: WebSite schema for Google Sitelinks Search Box */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Atlas Kings',
          url: SITE_URL,
          description: 'Independent football news, live scores, fixtures and standings covering Morocco, Botola Pro, Premier League, Champions League and the 2030 World Cup.',
          inLanguage: ['en', 'ar', 'fr'],
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        })}} />
        {/* JSON-LD: Organization schema for the Atlas Kings entity.
            Separate from WebSite so Google can wire brand knowledge
            panels, logo SERP results, and publisher attribution on
            shared article cards. Launch Session 2.2. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          '@id': `${SITE_URL}#organization`,
          name: 'Atlas Kings',
          legalName: 'Atlas Kings',
          url: SITE_URL,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/images/logo.png`,
            width: 512,
            height: 512,
          },
          description: 'Morocco-first football publication. Independent coverage of the Atlas Lions, Botola Pro, European leagues, and the 2026 and 2030 World Cups in English, Arabic, and French.',
          foundingLocation: {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'MA',
            },
          },
          knowsLanguage: ['en', 'ar', 'fr'],
        })}} />
      </head>
      <body>
        {children}
        {/* API-Football widget config */}
        <div
          dangerouslySetInnerHTML={{
            __html: `
              <api-sports-widget
                data-type="config"
                data-sport="football"
                data-key="${process.env.NEXT_PUBLIC_APIFOOTBALL_KEY ?? ''}"
                data-theme="dark"
                data-refresh="120"
                data-show-logos="true"
                data-show-errors="true"
                data-lang="en"
              ></api-sports-widget>
              <script>
                (function(){
                  var c=document.cookie.match(/atlas-lang=([^;]+)/);
                  var l=c?c[1]:'en';
                  var wl=l==='fr'?'fr':'en';
                  var w=document.querySelector('api-sports-widget[data-type="config"]');
                  if(w)w.setAttribute('data-lang',wl);
                })();
              </script>
            `,
          }}
        />
        <Script
          src="https://widgets.api-sports.io/3.1.0/widgets.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
