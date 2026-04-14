export const dynamic = 'force-dynamic'

export async function GET() {
  const key = process.env.APIFOOTBALL_KEY

  if (!key) {
    return Response.json({
      error: 'NO API KEY FOUND',
      hint: 'Add APIFOOTBALL_KEY=your_key to .env.local then restart npm run dev'
    })
  }

  const BASE = 'https://v3.football.api-sports.io'
  const headers = { 'x-apisports-key': key }

  try {
    const [statusRes, pl25Res, pl24Res] = await Promise.all([
      fetch(`${BASE}/status`, { headers, cache: 'no-store' }),
      fetch(`${BASE}/standings?league=39&season=2025`, { headers, cache: 'no-store' }),
      fetch(`${BASE}/standings?league=39&season=2024`, { headers, cache: 'no-store' }),
    ])

    const [status, pl25, pl24] = await Promise.all([
      statusRes.json(), pl25Res.json(), pl24Res.json()
    ])

    return Response.json({
      keyFound: true,
      keyPreview: key.substring(0, 8) + '...',
      account: status.response ?? status.errors,
      season2025: { results: pl25.results, hasData: (pl25.results ?? 0) > 0, errors: pl25.errors },
      season2024: { results: pl24.results, hasData: (pl24.results ?? 0) > 0, errors: pl24.errors },
    })
  } catch (err) {
    return Response.json({ fetchError: String(err) })
  }
}
