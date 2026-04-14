import { NextRequest, NextResponse } from 'next/server'
import { getMediaStats } from '@/lib/db/media'

const PIPELINE_SECRET = process.env.PIPELINE_SECRET

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (PIPELINE_SECRET && auth !== `Bearer ${PIPELINE_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const stage = searchParams.get('stage') ?? 'all'
  const limit = parseInt(searchParams.get('limit') ?? '50')

  const results: Record<string, unknown> = { stage }

  try {
    if (stage === 'fetch' || stage === 'all') {
      const { processFetchQueue } = await import('@/lib/media/fetcher')
      results.fetch = await processFetchQueue(limit)
    }

    if (stage === 'vision' || stage === 'all') {
      const { processVisionQueue } = await import('@/lib/media/vision')
      results.vision = await processVisionQueue(limit)
    }

    if (stage === 'rules' || stage === 'all') {
      const { applyContextRules } = await import('@/lib/media/rules')
      results.rules = await applyContextRules(limit)
    }

    if (stage === 'match' || stage === 'all') {
      const { matchAllUnmatchedArticles } = await import('@/lib/media/matcher')
      results.match = await matchAllUnmatchedArticles(limit)
    }

    // Include current stats
    results.stats = await getMediaStats()

    return NextResponse.json({ ok: true, ...results })
  } catch (err) {
    console.error(`[api/media/process] Error at stage=${stage}:`, err)
    return NextResponse.json({ error: 'Processing failed', stage, detail: String(err) }, { status: 500 })
  }
}

export async function GET() {
  try {
    const stats = await getMediaStats()
    return NextResponse.json({ ok: true, stats })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
