/**
 * One-shot cleanup: strip `image:` / `imageAlt:` lines from existing
 * article frontmatter where the image host is NOT in the Next.js
 * remotePatterns allowlist.
 *
 * Used after the first §2 regeneration run surfaced external image
 * hosts (e.g. e2.hespress.com) that next/image refuses to render.
 *
 * Run after adding new hosts to the allowlist, or run with `--report`
 * to preview what would be changed without writing.
 *
 * Usage:
 *   npx tsx scripts/scrub-bad-images.ts           # write changes
 *   npx tsx scripts/scrub-bad-images.ts --report  # dry-run, count only
 */

import fs from 'fs'
import path from 'path'

const ALLOWED_IMAGE_HOSTS: Array<string | RegExp> = [
  'media.api-sports.io',
  'media-2.api-sports.io',
  'media-3.api-sports.io',
  /\.r2\.dev$/,
]

function isAllowedImageUrl(url: string): boolean {
  try {
    const hostname = new URL(url).hostname
    return ALLOWED_IMAGE_HOSTS.some(pattern =>
      typeof pattern === 'string' ? pattern === hostname : pattern.test(hostname),
    )
  } catch {
    return false
  }
}

const ROOT = process.cwd()
const ARTICLES_DIR = path.join(ROOT, 'content', 'articles')
const LANG_DIRS = ['en', 'ar', 'fr']
const REPORT_MODE = process.argv.includes('--report')

let scanned = 0
let modified = 0
let droppedImages = 0
let keptImages = 0

for (const lang of LANG_DIRS) {
  const dir = path.join(ARTICLES_DIR, lang)
  if (!fs.existsSync(dir)) continue
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'))

  for (const file of files) {
    scanned++
    const full = path.join(dir, file)
    const raw = fs.readFileSync(full, 'utf8')

    // Extract image URL from frontmatter
    const imageMatch = raw.match(/^image:\s*"([^"]+)"\s*$/m)
    if (!imageMatch) continue

    const url = imageMatch[1]
    if (isAllowedImageUrl(url)) {
      keptImages++
      continue
    }

    droppedImages++
    if (REPORT_MODE) {
      console.log(`[DROP] ${lang}/${file} → ${url}`)
      continue
    }

    // Remove both the `image:` and the immediately-following `imageAlt:` line
    const cleaned = raw
      .replace(/^image:\s*"[^"]*"\s*\n/m, '')
      .replace(/^imageAlt:\s*"[^"]*"\s*\n/m, '')
    fs.writeFileSync(full, cleaned)
    modified++
  }
}

console.log('')
console.log('═'.repeat(50))
console.log(`  ${REPORT_MODE ? 'REPORT' : 'WRITE'} mode`)
console.log('═'.repeat(50))
console.log(`  Scanned:         ${scanned}`)
console.log(`  Kept images:     ${keptImages} (allowed host)`)
console.log(`  Dropped images:  ${droppedImages} (disallowed host)`)
if (!REPORT_MODE) {
  console.log(`  Files modified:  ${modified}`)
}
