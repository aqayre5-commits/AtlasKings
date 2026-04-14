// Standalone pipeline runner — executes the RSS → Claude rewrite pipeline
// Usage:
//   npx tsx scripts/run-pipeline.ts           # default: dry run, 8 articles
//   npx tsx scripts/run-pipeline.ts --live    # actually write files
//   npx tsx scripts/run-pipeline.ts --max=15  # change article count
//   npx tsx scripts/run-pipeline.ts --reset   # reprocess previously-seen items

// Load .env.local manually (tsx doesn't auto-load it like Next.js does)
import fs from 'fs'
import path from 'path'
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
    // Strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = val
  }
  console.log(`[env] Loaded .env.local (ANTHROPIC_API_KEY ${process.env.ANTHROPIC_API_KEY ? 'SET' : 'MISSING'})`)
}

import { runPipeline } from '@/lib/rss/pipeline'

const args = process.argv.slice(2)
const dryRun = !args.includes('--live')
const resetIndex = args.includes('--reset')
const maxArg = args.find(a => a.startsWith('--max='))
const maxArticles = maxArg ? parseInt(maxArg.split('=')[1], 10) : 8

console.log('═'.repeat(60))
console.log('  ATLAS KINGS — RSS PIPELINE RUNNER')
console.log('═'.repeat(60))
console.log(`  Mode: ${dryRun ? 'DRY RUN (no files written)' : 'LIVE (files written)'}`)
console.log(`  Max articles: ${maxArticles}`)
console.log(`  Reset index: ${resetIndex}`)
console.log('═'.repeat(60))
console.log('')

const start = Date.now()

runPipeline({ maxArticles, dryRun, resetIndex })
  .then(result => {
    const seconds = ((Date.now() - start) / 1000).toFixed(1)
    console.log('')
    console.log('═'.repeat(60))
    console.log('  RESULTS')
    console.log('═'.repeat(60))
    console.log(`  Total RSS items fetched:  ${result.fetched}`)
    console.log(`  New items (not in index): ${result.filtered}`)
    console.log(`  Articles created:         ${result.created}`)
    console.log(`  Errors:                   ${result.errors.length}`)
    console.log(`  Duration:                 ${seconds}s`)
    console.log('═'.repeat(60))

    if (result.articles.length > 0) {
      console.log('')
      console.log('  REWRITTEN ARTICLES:')
      result.articles.forEach((title, i) => {
        console.log(`  ${(i + 1).toString().padStart(2)}. ${title}`)
      })
    }

    if (result.errors.length > 0) {
      console.log('')
      console.log('  ERRORS:')
      result.errors.forEach(err => console.log(`  ✗ ${err}`))
    }

    process.exit(0)
  })
  .catch(err => {
    console.error('')
    console.error('  FATAL ERROR:', err.message)
    console.error(err.stack)
    process.exit(1)
  })
