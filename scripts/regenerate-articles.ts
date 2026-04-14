/**
 * One-shot script to regenerate the existing article corpus on the new
 * §2 rewriter prompt (≥500 words, 4-6 paragraphs, Morocco-first voice,
 * trust badges, hero images from RSS).
 *
 * Decision A1 from the §2 sign-off: regenerate ALL existing articles
 * rather than manually curating subsets.
 *
 * Safety:
 *   1. Aborts if any existing article has `trustState: editor-reviewed`
 *      in its frontmatter — those are human-curated and must not be
 *      destroyed silently.
 *   2. Backs up content/articles/ to content/articles.backup-{ts}/
 *      before any deletion.
 *   3. Wipes content/articles/{en,ar,fr}/*.md and the title-index file.
 *   4. Runs the pipeline with --reset --max=24 --live to regenerate.
 *
 * Usage:
 *   npx tsx scripts/regenerate-articles.ts
 *
 * Override defaults:
 *   npx tsx scripts/regenerate-articles.ts --max=30
 *   npx tsx scripts/regenerate-articles.ts --no-backup    # skip backup (unsafe)
 *   npx tsx scripts/regenerate-articles.ts --dry          # rehearse, no writes
 */

import fs from 'fs'
import path from 'path'

// ── Load .env.local manually (tsx doesn't pick it up like Next does) ──
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = val
  }
}

import { runPipeline } from '@/lib/rss/pipeline'

// ── Args ──────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const noBackup = args.includes('--no-backup')
const dryRun = args.includes('--dry')
const maxArg = args.find(a => a.startsWith('--max='))
const maxArticles = maxArg ? parseInt(maxArg.split('=')[1], 10) : 24

// ── Paths ─────────────────────────────────────────────────────────────

const ROOT = process.cwd()
const ARTICLES_DIR = path.join(ROOT, 'content', 'articles')
const LANG_DIRS = ['en', 'ar', 'fr']

// ── Step 1 — pre-flight safety ────────────────────────────────────────

function findEditorReviewedArticles(): string[] {
  const found: string[] = []
  for (const lang of LANG_DIRS) {
    const dir = path.join(ARTICLES_DIR, lang)
    if (!fs.existsSync(dir)) continue
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'))
    for (const file of files) {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8')
      // Look for `trustState: editor-reviewed` in YAML frontmatter
      if (/^trustState:\s*editor-reviewed\s*$/m.test(raw)) {
        found.push(`${lang}/${file}`)
      }
    }
  }
  return found
}

// ── Step 2 — backup ───────────────────────────────────────────────────

function backupArticles(): string | null {
  if (noBackup) return null
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const backupDir = path.join(ROOT, 'content', `articles.backup-${ts}`)

  // Recursive copy via fs.cpSync (Node 16.7+)
  fs.cpSync(ARTICLES_DIR, backupDir, { recursive: true })
  return backupDir
}

// ── Step 3 — wipe ─────────────────────────────────────────────────────

function wipeArticles(): { mdFiles: number; indexes: number } {
  let mdFiles = 0
  let indexes = 0
  for (const lang of LANG_DIRS) {
    const dir = path.join(ARTICLES_DIR, lang)
    if (!fs.existsSync(dir)) continue
    const files = fs.readdirSync(dir)
    for (const file of files) {
      const full = path.join(dir, file)
      if (file.endsWith('.md')) {
        fs.unlinkSync(full)
        mdFiles++
      } else if (file === '.title-index.json') {
        fs.unlinkSync(full)
        indexes++
      }
    }
  }
  return { mdFiles, indexes }
}

// ── Step 4 — regenerate via pipeline ──────────────────────────────────

async function regenerate() {
  const result = await runPipeline({
    maxArticles,
    dryRun: false,
    resetIndex: true,
  })
  return result
}

// ── Main ──────────────────────────────────────────────────────────────

async function main() {
  console.log('═'.repeat(60))
  console.log('  ATLAS KINGS — Article Corpus Regeneration')
  console.log('═'.repeat(60))
  console.log(`  Mode:        ${dryRun ? 'DRY (rehearsal, no writes)' : 'LIVE'}`)
  console.log(`  Backup:      ${noBackup ? 'SKIPPED' : 'enabled'}`)
  console.log(`  Max articles: ${maxArticles}`)
  console.log('═'.repeat(60))

  // Step 1 — pre-flight safety
  const protectedFiles = findEditorReviewedArticles()
  if (protectedFiles.length > 0) {
    console.error('')
    console.error('  ✗ ABORT: editor-reviewed articles detected.')
    console.error('  These would be destroyed by the regeneration:')
    protectedFiles.forEach(f => console.error(`    - ${f}`))
    console.error('')
    console.error('  Move them out of content/articles/ before re-running.')
    process.exit(1)
  }
  console.log('  ✓ No editor-reviewed articles to protect — safe to proceed.')

  if (dryRun) {
    console.log('')
    console.log('  [dry-run] Would back up, wipe, and regenerate the corpus.')
    console.log('  [dry-run] No files touched.')
    return
  }

  // Step 2 — backup
  const backupDir = backupArticles()
  if (backupDir) {
    console.log(`  ✓ Backup written to ${path.relative(ROOT, backupDir)}`)
  } else {
    console.log('  ! Skipping backup (--no-backup)')
  }

  // Step 3 — wipe
  const wiped = wipeArticles()
  console.log(`  ✓ Wiped ${wiped.mdFiles} .md files and ${wiped.indexes} title index(es)`)

  // Step 4 — regenerate
  console.log('')
  console.log('  Running pipeline (this will hit Claude + RSS feeds)…')
  console.log('')
  const start = Date.now()
  const result = await regenerate()
  const duration = ((Date.now() - start) / 1000).toFixed(1)

  console.log('')
  console.log('═'.repeat(60))
  console.log('  RESULTS')
  console.log('═'.repeat(60))
  console.log(`  Fetched RSS items:    ${result.fetched}`)
  console.log(`  New (post-reset):     ${result.filtered}`)
  console.log(`  Articles created:     ${result.created}`)
  console.log(`  Errors:               ${result.errors.length}`)
  console.log(`  Duration:             ${duration}s`)
  if (backupDir) {
    console.log(`  Rollback path:        ${path.relative(ROOT, backupDir)}`)
  }
  console.log('═'.repeat(60))

  if (result.created > 0) {
    console.log('')
    console.log('  Created articles:')
    result.articles.forEach((title, i) => {
      console.log(`  ${(i + 1).toString().padStart(2)}. ${title}`)
    })
  }

  if (result.errors.length > 0) {
    console.log('')
    console.log('  Errors:')
    result.errors.forEach(e => console.log(`  ✗ ${e}`))
  }
}

main().catch(err => {
  console.error('')
  console.error('  FATAL:', err.message ?? err)
  console.error(err.stack)
  process.exit(1)
})
