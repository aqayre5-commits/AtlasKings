import { redirect } from 'next/navigation'

/**
 * /morocco/table has been absorbed into /morocco/qualification, which
 * now renders Morocco's WC 2026 Group C and AFCON qualifying group
 * side-by-side. Keeping this path alive as a permanent redirect so any
 * inbound link (external sitemap caches, bookmarks) still lands on the
 * right page.
 */
export default function MoroccoTableRedirect() {
  redirect('/morocco/qualification')
}
