import { NextResponse } from 'next/server'
import { runDatabasePipeline } from '@/lib/db/pipeline'

/**
 * POST /api/pipeline/db — Run the full database-backed article pipeline
 *
 * Query params:
 *   ?max=10 — Max articles to generate (default 10)
 *
 * Usage:
 *   curl -X POST "http://localhost:3000/api/pipeline/db?max=5"
 */
export async function POST(request: Request) {
  // Auth check
  const secret = process.env.PIPELINE_SECRET
  if (secret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const { searchParams } = new URL(request.url)
  const max = parseInt(searchParams.get('max') ?? '10')

  try {
    const result = await runDatabasePipeline({ maxArticles: max })
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: 'Pipeline failed', message: (err as Error).message },
      { status: 500 }
    )
  }
}

/**
 * GET /api/pipeline/db — Check pipeline status
 */
export async function GET() {
  try {
    const { query } = await import('@/lib/db/client')
    const stats = await query(`
      SELECT
        (SELECT count(*) FROM atlas.source_items) as total_items,
        (SELECT count(*) FROM atlas.story_clusters) as total_clusters,
        (SELECT count(*) FROM atlas.articles) as total_articles,
        (SELECT count(*) FROM atlas.article_localizations) as total_localizations,
        (SELECT count(*) FROM atlas.players WHERE moroccan_origin_flag = true) as moroccan_players,
        (SELECT count(*) FROM atlas.sources WHERE active = true) as active_sources
    `)
    return NextResponse.json({ status: 'ready', stats: stats[0] })
  } catch (err) {
    return NextResponse.json({ status: 'error', message: (err as Error).message })
  }
}
