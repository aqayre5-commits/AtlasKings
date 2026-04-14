// Rewrite 3 Morocco items and print FULL content for quality inspection.
import fs from 'fs'
import path from 'path'

// Load .env.local
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq === -1) continue
    const k = t.slice(0, eq).trim()
    let v = t.slice(eq + 1).trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
    if (!process.env[k]) process.env[k] = v
  }
}

import { fetchAllFeeds } from '@/lib/rss/fetcher'
import { rewriteArticle, detectCategory, detectTeams, detectType, translateArticle } from '@/lib/rss/rewriter'
import { MOROCCO_SQUAD_NAMES } from '@/lib/rss/feeds'

async function main() {
  console.log('[Inspect] Fetching feeds...')
  const items = await fetchAllFeeds()
  console.log(`[Inspect] ${items.length} items fetched.`)

  // Score items — strong Morocco boost
  const scored = items.map(item => {
    let score = item.sourcePriority
    const text = `${item.title} ${item.description}`.toLowerCase()
    const moroccoHits = MOROCCO_SQUAD_NAMES.filter(n => text.includes(n)).length
    if (moroccoHits > 0) score += 30 + moroccoHits * 5
    if (text.includes('atlas lions') || text.includes('morocco')) score += 20
    return { ...item, _score: score }
  })

  // Pick top 3 most diverse (different sources + categories)
  scored.sort((a, b) => b._score - a._score)
  const picked: typeof scored = []
  const seenSources = new Set<string>()
  for (const item of scored) {
    if (picked.length >= 3) break
    if (seenSources.has(item.source)) continue
    picked.push(item)
    seenSources.add(item.source)
  }

  console.log(`\n[Inspect] Selected ${picked.length} items:\n`)
  for (let i = 0; i < picked.length; i++) {
    const item = picked[i]
    console.log(`\n${'═'.repeat(70)}`)
    console.log(`ARTICLE ${i + 1} — Source: ${item.source} (lang: ${item.sourceLang})`)
    console.log('═'.repeat(70))
    console.log(`\n── ORIGINAL ──`)
    console.log(`Title:       ${item.title}`)
    console.log(`Description: ${item.description.slice(0, 300)}${item.description.length > 300 ? '…' : ''}`)
    console.log(`Link:        ${item.link}`)
    console.log(`PubDate:     ${item.pubDate}`)

    console.log(`\n── CLAUDE REWRITE ──`)
    const rewritten = await rewriteArticle({
      title: item.title,
      description: item.description,
      source: item.source,
    })

    if (!rewritten) {
      console.log('  ❌ Rewrite failed')
      continue
    }

    const category = detectCategory(item.title, item.description, item.sourceCategories)
    const teams = detectTeams(`${item.title} ${item.description}`)
    const type = detectType(item.title)

    console.log(`\nTitle:    ${rewritten.title}`)
    console.log(`Excerpt:  ${rewritten.excerpt}`)
    console.log(`Category: ${category}`)
    console.log(`Teams:    [${teams.join(', ')}]`)
    console.log(`Type:     ${type}`)
    console.log(`\nBody:\n${rewritten.content}\n`)
  }
}

main().catch(e => { console.error(e); process.exit(1) })
