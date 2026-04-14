import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { runPipeline } from '@/lib/rss/pipeline'

/**
 * POST /api/pipeline — Trigger the article pipeline
 * Protected by PIPELINE_SECRET env var.
 *
 * Query params:
 *   ?max=10 — Max articles to generate (default 10)
 *   ?dry=true — Dry run, don't save
 *
 * Usage:
 *   curl -X POST "http://localhost:3000/api/pipeline?max=5" -H "Authorization: Bearer YOUR_SECRET"
 */
export async function POST(request: Request) {
  // Auth check — ALWAYS require secret (never bypass)
  const secret = process.env.PIPELINE_SECRET
  if (!secret) {
    console.error('[Pipeline] PIPELINE_SECRET not configured')
    return NextResponse.json({ error: 'Pipeline not configured' }, { status: 503 })
  }
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const max = parseInt(searchParams.get('max') ?? '10')
  const dryRun = searchParams.get('dry') === 'true'
  const resetIndex = searchParams.get('reset') === 'true'

  try {
    const result = await runPipeline({ maxArticles: max, dryRun, resetIndex })
    return NextResponse.json(result)
  } catch (err) {
    const error = err as Error
    // Pipeline failures are high-signal: they usually mean an upstream
    // AI/feed outage or a code bug. Report as error (not warning) so they
    // don't get filtered with the noisy data-service warnings.
    Sentry.captureException(error, {
      tags: {
        source: 'api-pipeline',
        dryRun: String(dryRun),
      },
      extra: { max, resetIndex },
      level: 'error',
    })
    return NextResponse.json(
      { error: 'Pipeline failed', message: error.message },
      { status: 500 }
    )
  }
}

/**
 * GET /api/pipeline — Check pipeline status
 */
export async function GET() {
  return NextResponse.json({
    status: 'ready',
    info: 'POST to this endpoint to run the article pipeline. Pass ?max=N to limit articles.',
  })
}
