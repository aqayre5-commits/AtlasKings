// AI Article Rewriter — generates original articles from RSS headlines
import Anthropic from '@anthropic-ai/sdk'
import { MOROCCO_SQUAD_NAMES, TRACKED_OPPONENTS_FALLBACK } from './feeds'
import type { ArticleCategory, ArticleType } from '@/types/article'

const CATEGORY_KEYWORDS: Record<ArticleCategory, string[]> = {
  'morocco': ['morocco', 'atlas lions', 'hakimi', 'botola', 'moroccan', 'ouahbi', 'afcon', 'regragui'],
  'botola-pro': ['botola', 'raja', 'wydad', 'far rabat', 'berkane', 'moroccan league'],
  'premier-league': ['premier league', 'arsenal', 'liverpool', 'man city', 'chelsea', 'tottenham', 'newcastle', 'man united', 'aston villa', 'west ham', 'brighton', 'everton'],
  'la-liga': ['la liga', 'real madrid', 'barcelona', 'atletico', 'sevilla', 'villarreal', 'betis'],
  'champions-league': ['champions league', 'ucl', 'uefa'],
  'transfers': ['transfer', 'signing', 'deal', 'loan', 'contract', 'bid', 'fee'],
  'world-cup': ['world cup', 'fifa 2026', 'fifa 2030'],
  'analysis': ['analysis', 'tactical', 'breakdown'],
  'opinion': ['opinion', 'column', 'editorial'],
}

const TEAM_KEYWORDS: Record<string, string> = {
  'morocco': 'morocco', 'atlas lions': 'morocco', 'hakimi': 'morocco',
  'ouahbi': 'morocco', 'real madrid': 'real-madrid', 'barcelona': 'barcelona',
  'arsenal': 'arsenal', 'liverpool': 'liverpool', 'man city': 'manchester-city',
  'chelsea': 'chelsea', 'bayern': 'bayern-munich', 'psg': 'psg',
  'tottenham': 'tottenham', 'man united': 'manchester-united',
  'raja': 'raja-ca', 'wydad': 'wydad-ac',
}

/**
 * Detect article category from title + description.
 */
export function detectCategory(title: string, description: string, sourceCategories: string[]): ArticleCategory {
  const text = `${title} ${description}`.toLowerCase()

  let bestCategory: ArticleCategory = 'premier-league'
  let bestScore = 0

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0
    for (const kw of keywords) {
      if (text.includes(kw)) score += 1
    }
    // Boost if source is tagged with this category
    if (sourceCategories.includes(category)) score += 0.5
    if (score > bestScore) {
      bestScore = score
      bestCategory = category as ArticleCategory
    }
  }

  // Morocco player/opponent detection — override category to 'morocco' if strong match
  const moroccoMentions = MOROCCO_SQUAD_NAMES.filter(name => text.includes(name)).length
  const opponentMentions = TRACKED_OPPONENTS_FALLBACK.filter(name => text.includes(name)).length
  if (moroccoMentions >= 1) {
    bestCategory = 'morocco'
  } else if (opponentMentions >= 1 && bestScore < 2) {
    // Opponent mentioned but no strong league category — tag as morocco context
    bestCategory = 'morocco'
  }

  return bestCategory
}

/**
 * Detect teams mentioned in text.
 */
export function detectTeams(text: string): string[] {
  const lower = text.toLowerCase()
  const teams: string[] = []

  // Check for Moroccan player mentions → always tag 'morocco'
  const hasMoroccanPlayer = MOROCCO_SQUAD_NAMES.some(name => lower.includes(name))
  if (hasMoroccanPlayer && !teams.includes('morocco')) {
    teams.push('morocco')
  }

  for (const [keyword, team] of Object.entries(TEAM_KEYWORDS)) {
    if (lower.includes(keyword) && !teams.includes(team)) {
      teams.push(team)
    }
  }
  return teams
}

/**
 * Detect article type from title.
 */
export function detectType(title: string): ArticleType {
  const t = title.toLowerCase()
  if (t.includes('breaking') || t.includes('confirmed') || t.includes('official')) return 'breaking'
  if (t.includes('preview') || t.includes('prediction')) return 'preview'
  if (t.includes('result') || t.includes('beat') || t.includes('win') || t.includes('draw') || t.includes('defeat')) return 'recap'
  if (t.includes('transfer') || t.includes('signing') || t.includes('deal') || t.includes('bid')) return 'transfer'
  if (t.includes('analysis') || t.includes('tactical')) return 'analysis'
  return 'standard'
}

/**
 * Rewrite a news headline + description into a 500-600 word original article
 * using Claude API (Haiku for speed and cost).
 *
 * Updated for §2 article content + trust pass:
 *   - Length floor raised from 2-3 paragraphs (~200 words) → 4-6 paragraphs
 *     (~500-600 words) for SEO authority and Google News eligibility.
 *   - Editorial voice baked in: authoritative, Morocco-first, mildly warm,
 *     never sensationalist.
 *   - Required Morocco angle: every story finds its Morocco hook where one
 *     plausibly exists; if no hook, the article still ends with a brief
 *     "what this means for the wider game" paragraph.
 *   - max_tokens: 500 → 1200 (English averages ~0.75 words/token, 1200
 *     comfortably accommodates 600-word output + structured headers).
 */
export async function rewriteArticle(params: {
  title: string
  description: string
  source: string
}): Promise<{ title: string; excerpt: string; content: string } | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.warn('[Rewriter] No ANTHROPIC_API_KEY set')
    return null
  }

  try {
    const client = new Anthropic({ apiKey })

    // Detect if this is an Algeria/rivalry article — adjust prompt
    const textLower = `${params.title} ${params.description}`.toLowerCase()
    const isAlgeriaRivalry = ['algeria', 'algerian', 'algerie', 'الجزائر', 'djamel belmadi'].some(t => textLower.includes(t))
      && ['morocco', 'maroc', 'المغرب', '2030', 'world cup', 'atlas lions', 'hakimi'].some(t => textLower.includes(t))

    const rivalryContext = isAlgeriaRivalry
      ? '\n\nIMPORTANT: This article involves the Algeria-Morocco rivalry. Write from a balanced but pro-Moroccan perspective. If Algeria is criticizing Morocco or Moroccan football, present the facts but include Morocco\'s achievements and counterarguments. Never be inflammatory — be professional and factual.'
      : ''

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1200,
      messages: [{
        role: 'user',
        content: `You are a football journalist writing for Atlas Kings, a Morocco-first football publication.

VOICE
- Authoritative but warm. Never sensationalist, never clickbait, never breathless.
- Write like a working football journalist who knows the sport at a professional level.
- Address football fans who already know the game — no over-explaining basics.

LENGTH AND STRUCTURE
- Write 500–600 words minimum.
- Structure as 4–6 substantive paragraphs with these beats:
    1. Lede paragraph: the news, what just happened, key facts.
    2. Context: how we got here, what came before, why this matters now.
    3. Main analysis: deeper detail, stats or quotes if implied by the source, tactical or contractual nuance.
    4. Morocco angle: where does Morocco or a Moroccan player fit into this story? If none plausibly exists, write a brief "what this means for the wider game" paragraph instead.
    5. (Optional) Looking ahead: what to watch next, what's at stake, when the next data point arrives.
- Do not invent facts. Stay grounded in what the source headline and summary actually say. You may add reasonable contextual framing a knowledgeable journalist would know (league standings context, well-known career history, etc.) but never fabricate quotes, scores, dates, or events.

EDITORIAL STANCE
- Morocco-first means: if a Moroccan player, club, or the national team is involved, give them the lead framing.
- For non-Morocco stories, write neutrally and professionally.
- Never use exclamation marks. Never use "stunning," "shocking," "explosive," or other tabloid intensifiers.
- Use the present tense for current state, past tense for what happened.${rivalryContext}

INPUT
Headline: ${params.title}
Summary: ${params.description}

OUTPUT FORMAT
Respond in this EXACT format with no extra commentary:

TITLE: [Your rewritten headline — original wording, not copied from input]
EXCERPT: [One sentence, 15–25 words, that summarizes the article and would work as a search result snippet]
BODY:
[4–6 paragraphs of original content meeting the length and structure above, separated by blank lines]`
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    const titleMatch = text.match(/TITLE:\s*(.+)/)?.[1]?.trim()
    const excerptMatch = text.match(/EXCERPT:\s*(.+)/)?.[1]?.trim()
    const bodyMatch = text.match(/BODY:\s*([\s\S]+)/)?.[1]?.trim()

    if (!titleMatch || !bodyMatch) return null

    return {
      title: titleMatch,
      excerpt: excerptMatch ?? '',
      content: bodyMatch,
    }
  } catch (err) {
    const e = err as any
    console.error('[Rewriter] API error:', e.message ?? e)
    if (e.status) console.error('[Rewriter] Status:', e.status)
    if (e.error) console.error('[Rewriter] Detail:', JSON.stringify(e.error).slice(0, 200))
    return null
  }
}

/**
 * Translate an article title and content to Arabic or French using Claude.
 *
 * Token budget tuning (§2 fix for Arabic mid-sentence truncation):
 *   English source ~600 words ≈ 800 tokens.
 *   French translation ≈ 1.1× → ~880 tokens.
 *   Arabic translation ≈ 1.4× → ~1120 tokens (Arabic is more
 *   token-dense than Latin scripts in the BPE tokenizer).
 *   We allocate 2000 max_tokens — generous headroom over the
 *   measured worst case so the model never hits the ceiling
 *   mid-sentence. Output is billed by actual usage, so the higher
 *   ceiling has effectively zero cost impact.
 */
export async function translateArticle(params: {
  title: string
  excerpt: string
  content: string
  targetLang: 'ar' | 'fr'
}): Promise<{ title: string; excerpt: string; content: string } | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return null

  const langName = params.targetLang === 'ar' ? 'Arabic (Modern Standard Arabic)' : 'French'

  try {
    const client = new Anthropic({ apiKey })

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `Translate this football news article to ${langName}. Preserve the journalistic voice — authoritative but warm, never sensationalist. Keep paragraph breaks. Translate the entire body in full; do not summarize or shorten.

TITLE: ${params.title}
EXCERPT: ${params.excerpt}
BODY:
${params.content}

Respond in this exact format:
TITLE: [translated title]
EXCERPT: [translated excerpt]
BODY:
[full translated body — every paragraph]`
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const titleMatch = text.match(/TITLE:\s*(.+)/)?.[1]?.trim()
    const excerptMatch = text.match(/EXCERPT:\s*(.+)/)?.[1]?.trim()
    const bodyMatch = text.match(/BODY:\s*([\s\S]+)/)?.[1]?.trim()

    if (!titleMatch || !bodyMatch) return null
    return { title: titleMatch, excerpt: excerptMatch ?? '', content: bodyMatch }
  } catch {
    return null
  }
}
