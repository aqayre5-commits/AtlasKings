import { pageMetadata } from '@/lib/seo/pageMetadata'
import Link from 'next/link'
import { getAllStandings } from '@/lib/api-football/standings'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { WhatsAppShare } from '@/components/ui/WhatsAppShare'
import { EmptyState } from '@/components/ui/EmptyState'
import { TeamLogo } from '@/components/ui/TeamLogo'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return pageMetadata('standings', lang, '/standings')
}
export const revalidate = 3600

function FormDots({ form }: { form: string }) {
  return (
    <span style={{ display: 'flex', gap: 3 }}>
      {form.split('').map((r, i) => (
        <span key={i} className={`fd ${r === 'W' ? 'fw' : r === 'L' ? 'fl' : 'fdraw'}`} />
      ))}
    </span>
  )
}

const LEAGUE_LABELS: Record<string, { name: string; color: string; href: string }> = {
  pl: { name: 'Premier League', color: '#3d195b', href: '/premier-league/table' },
  botola: { name: 'Botola Pro', color: '#0a5229', href: '/botola-pro/table' },
  laliga: { name: 'La Liga', color: '#ee8700', href: '/la-liga/table' },
  ucl: { name: 'Champions League', color: '#0a1f5c', href: '/champions-league/groups' },
}

export default async function StandingsPage() {
  const standings = await getAllStandings().catch(() => ({} as Record<string, { name: string; season: string; rows: import('@/lib/data/placeholderData').StandingRow[] }>))
  const keys = Object.keys(standings).filter(k => standings[k]?.rows?.length > 0)

  return (
    <main>
      <div className="page-wrap">
        <Breadcrumb items={[{ label: 'Standings' }]} />
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--gap)' }}>
          {keys.length > 0 ? keys.map(key => {
            const league = LEAGUE_LABELS[key]
            const rows = standings[key].rows.slice(0, 8)
            if (!league) return null
            return (
              <div key={key} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="sec-head">
                  <div className="sec-bar" style={{ background: league.color }} />
                  <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text)', flex: 1 }}>
                    {league.name}
                  </h2>
                  <WhatsAppShare text={`${league.name} standings`} variant="icon" />
                  <Link href={league.href} className="sec-cta">Full table</Link>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th className="left">Club</th>
                      <th>P</th>
                      <th>GD</th>
                      <th>Pts</th>
                      <th>Form</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(row => (
                      <tr key={`${row.pos}-${row.team}`}>
                        <td>{row.pos}</td>
                        <td className="team-name" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <TeamLogo src={row.logo} alt={row.team} size={16} />
                          {row.team}
                        </td>
                        <td>{row.played}</td>
                        <td>{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                        <td className="pts">{row.pts}</td>
                        <td><FormDots form={row.form} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }) : (
            <div className="card">
              <EmptyState icon="📊" title="Standings loading" description="League tables will appear here." />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
