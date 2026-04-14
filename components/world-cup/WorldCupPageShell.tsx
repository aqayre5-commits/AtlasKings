import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'

interface Props {
  title: string
  /** Optional dek rendered under the h1. Keep short, Morocco-first. */
  description?: string
  children: React.ReactNode
  lang?: string
  /** Whether this is the hub page (shows only "WC 2026" crumb) or a
   *  sub-page (shows "WC 2026 › {title}"). Defaults to sub-page. */
  isHub?: boolean
  /** When true, hides breadcrumb + h1 + dek (section has its own SectionBar). */
  hideBreadcrumb?: boolean
}

/**
 * Shared shell for the WC 2026 cluster. Renders a breadcrumb, a
 * localised `<h1>` from the `title` prop and an optional dek from
 * `description`, then the sticky sub-nav, then the page body inside
 * `.page-wrap`.
 *
 * Launch Session 1.4: previously this component ignored its `title`
 * and `description` props, leaving every /wc-2026/* page without an
 * h1. Fixed.
 *
 * Launch Session 2.3: breadcrumb added. Uses isHub to differentiate
 * the hub crumb (`Home › WC 2026`) from sub-page crumbs
 * (`Home › WC 2026 › {title}`).
 */
export async function WorldCupPageShell({
  title,
  description,
  children,
  lang = 'en',
  isHub = false,
  hideBreadcrumb = false,
}: Props) {
  const validLang = (['en', 'ar', 'fr'].includes(lang) ? lang : 'en') as Lang
  const t = getTranslations(validLang)
  const p = lang === 'en' ? '' : `/${lang}`
  const wcLabel = t.nav.wc2026

  return (
    <main>
      <div className="page-wrap" style={{ paddingTop: 'var(--gap)' }}>

        {children}
      </div>
    </main>
  )
}
