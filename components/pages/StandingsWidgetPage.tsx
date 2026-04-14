import { WidgetPageShell } from '@/components/layout/WidgetPageShell'
import { getStandings } from '@/lib/api-football/standings'
import ApiSportsWidget from '@/components/ui/ApiSportsWidget'
import { TeamLogo } from '@/components/ui/TeamLogo'
import type { ArticleCategory } from '@/types/article'
import type { LeagueKey } from '@/lib/api-football/leagues'

interface Props {
  title: string
  section: string
  sectionHref: string
  category: ArticleCategory
  leagueId: number
  leagueKey?: LeagueKey
  lang?: string
}

const ID_TO_KEY: Record<number, LeagueKey> = {
  200: 'botola', 39: 'pl', 140: 'laliga', 2: 'ucl', 6: 'afcon', 1: 'wc',
}

function FormDots({ form }: { form: string }) {
  return (
    <span style={{ display: 'flex', gap: 3 }}>
      {form.split('').map((r, i) => (
        <span key={i} className={`fd ${r === 'W' ? 'fw' : r === 'L' ? 'fl' : 'fdraw'}`} />
      ))}
    </span>
  )
}

export default async function StandingsWidgetPage({ title, section, sectionHref, category, leagueId, leagueKey, lang }: Props) {
  const key = leagueKey ?? ID_TO_KEY[leagueId]
  const rows = key ? await getStandings(key).catch(() => []) : []

  return (
    <WidgetPageShell section={section} sectionHref={sectionHref} title="Table" category={category} lang={lang}>
      {rows.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ minWidth: 640 }}>
            <thead>
              <tr>
                <th>#</th>
                <th className="left">Club</th>
                <th>MP</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>GF</th>
                <th>GA</th>
                <th>GD</th>
                <th>Pts</th>
                <th>Form</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const statusColor = row.status === 'champions' ? 'var(--live)' : row.status === 'ucl' ? 'var(--navy)' : row.status === 'uel' ? 'var(--gold)' : row.status === 'relegation' ? 'var(--red)' : 'transparent'
                const prevStatus = i > 0 ? rows[i - 1].status : row.status
                const showDivider = i > 0 && prevStatus !== row.status

                return (
                  <tr key={`${i}-${row.pos}-${row.team}`} style={{ borderTop: showDivider ? '2px solid var(--border-mid)' : undefined }}>
                    <td style={{ position: 'relative' }}>
                      <span className="pos-bar" style={{ background: statusColor }} />
                      {row.pos}
                    </td>
                    <td className="team-name" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <TeamLogo src={row.logo} alt={row.team} size={18} />
                      {row.team}
                    </td>
                    <td>{row.played}</td>
                    <td>{row.won}</td>
                    <td>{row.drawn}</td>
                    <td>{row.lost}</td>
                    <td>{row.gf}</td>
                    <td>{row.ga}</td>
                    <td style={{ fontWeight: 600, color: row.gd > 0 ? 'var(--live)' : row.gd < 0 ? 'var(--red)' : undefined }}>
                      {row.gd > 0 ? `+${row.gd}` : row.gd}
                    </td>
                    <td className="pts">{row.pts}</td>
                    <td><FormDots form={row.form} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ overflow: 'hidden' }}>
          <ApiSportsWidget type="standings" leagueId={leagueId} lang={lang} minHeight={500} />
        </div>
      )}
    </WidgetPageShell>
  )
}
