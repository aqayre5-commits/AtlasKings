import { NextRequest, NextResponse } from 'next/server'
import {
  SUPPORTED_LANGS, DEFAULT_LANG, LANG_COOKIE, LANG_COOKIE_MAX_AGE,
  detectLangFromCountry, type Lang,
} from '@/lib/i18n/config'

const PUBLIC_PATHS = [
  '/_next', '/api', '/images', '/fonts',
  // Static asset folders under `public/` that ship our own
  // images + SVGs. Skipping language routing here prevents
  // Next.js from rewriting `/brand/wc-2026-trophy.svg` to
  // `/en/brand/wc-2026-trophy.svg` and returning 404.
  '/brand',
  '/sitemap.xml', '/robots.txt', '/favicon.ico', '/manifest.json',
  '/sw.js', '/icon-', '/badge-',
  // Sentry browser-side error tunnel (configured via next.config.js
  // `tunnelRoute: '/monitoring'`). Must skip language routing so the
  // POST body reaches the Sentry SDK handler intact.
  '/monitoring',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static files and API routes
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Check if path already starts with a supported lang prefix
  const pathLang = SUPPORTED_LANGS.find(l =>
    pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  )

  if (pathLang) {
    // Already has a lang prefix — honour it and set cookie
    const response = NextResponse.next()
    response.cookies.set(LANG_COOKIE, pathLang, {
      maxAge: LANG_COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'lax',
    })
    return response
  }

  // No lang prefix — detect language
  let lang: Lang = DEFAULT_LANG

  // 1. Cookie wins
  const cookieLang = request.cookies.get(LANG_COOKIE)?.value as Lang | undefined
  if (cookieLang && SUPPORTED_LANGS.includes(cookieLang)) {
    lang = cookieLang
  } else {
    // 2. Vercel geo
    const country = request.headers.get('x-vercel-ip-country')
    lang = detectLangFromCountry(country)

    // 3. Accept-Language fallback
    if (lang === DEFAULT_LANG) {
      const acceptLang = request.headers.get('accept-language') ?? ''
      if (acceptLang.includes('ar')) lang = 'ar'
      else if (acceptLang.includes('fr')) lang = 'fr'
    }
  }

  // Rewrite ALL paths to include lang prefix internally
  // This ensures app/[lang]/ routing works for all languages including English
  const url = request.nextUrl.clone()
  url.pathname = `/${lang}${pathname === '/' ? '' : pathname}`

  if (lang === DEFAULT_LANG) {
    // For English: internal rewrite (URL stays clean, no /en/ visible)
    return NextResponse.rewrite(url)
  } else {
    // For AR/FR: redirect so URL shows the lang prefix
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js).*)',
  ],
}
