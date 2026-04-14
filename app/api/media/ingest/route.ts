import { NextRequest, NextResponse } from 'next/server'
import { ingestAllMedia } from '@/lib/media/ingest'

const PIPELINE_SECRET = process.env.PIPELINE_SECRET

export async function POST(req: NextRequest) {
  // Auth check
  const auth = req.headers.get('authorization')
  if (PIPELINE_SECRET && auth !== `Bearer ${PIPELINE_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('mode') ?? 'basic'

  try {
    if (mode === 'expanded') {
      // Pull full squads from all tracked leagues via API-Football
      // This can take several minutes due to API rate limits
      const { ingestExpandedMedia } = await import('@/lib/media/ingest-expanded')
      const leagues = searchParams.get('leagues')?.split(',') as any[] | undefined
      const result = await ingestExpandedMedia(leagues)
      return NextResponse.json({
        ok: true,
        mode: 'expanded',
        message: `Created ${result.teamsCreated} teams, ${result.playersCreated} players, ${result.mediaCreated} media assets`,
        ...result,
      })
    }

    // Basic mode — ingest from existing DB entities only
    const result = await ingestAllMedia()
    return NextResponse.json({
      ok: true,
      mode: 'basic',
      message: `Ingested ${result.total} media assets`,
      ...result,
    })
  } catch (err) {
    console.error('[api/media/ingest] Error:', err)
    return NextResponse.json({ error: 'Ingestion failed', detail: String(err) }, { status: 500 })
  }
}
