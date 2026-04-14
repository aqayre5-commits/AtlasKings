import { categoryColor } from '@/lib/utils'
import type { ArticleCategory } from '@/types/article'

interface SubLink {
  label: string
  href: string
}

interface SubPageProps {
  section: string
  sectionHref: string
  title: string
  category: ArticleCategory
  subLinks: SubLink[]
  activeHref: string
  children: React.ReactNode
}

export function SubPage({ children }: SubPageProps) {
  return (
    <main>
      <div className="page-wrap">
        {children}
      </div>
    </main>
  )
}
