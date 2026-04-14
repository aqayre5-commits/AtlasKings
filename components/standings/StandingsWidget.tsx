import { SectionHeader } from '@/components/ui/SectionHeader'

interface TeamRow {
  pos: number
  name: string
  played: number
  gd: number
  pts: number
  form: string
}

interface StandingsWidgetProps {
  title: string
  teams: TeamRow[]
  href: string
}

function FormDot({ result }: { result: string }) {
  const bg = result === 'W' ? 'var(--live)' : result === 'L' ? 'var(--red)' : '#c0bbb4'
  return <span style={{ width: 7, height: 7, borderRadius: '50%', background: bg, display: 'inline-block', flexShrink: 0 }} />
}

export function StandingsWidget({ title, teams, href }: StandingsWidgetProps) {
  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
      marginTop: 'var(--gap)',
    }}>
      <SectionHeader title={title} color="var(--red)" />
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['#', 'Team', 'P', 'GD', 'Pts', 'Form'].map(h => (
              <th key={h} style={{
                fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600,
                letterSpacing: '0.07em', color: 'var(--text-faint)',
                padding: '7px 6px', textAlign: h === 'Team' || h === '#' ? 'left' : 'center',
                borderBottom: '1px solid var(--border)',
                background: 'var(--card-alt)', textTransform: 'uppercase',
                paddingLeft: h === '#' ? 14 : 6,
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {teams.map((team, i) => (
            <tr key={team.name} style={{ borderBottom: i < teams.length - 1 ? '1px solid #eeede9' : 'none' }}>
              <td style={{ padding: '7px 6px 7px 14px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)' }}>
                {team.pos}
              </td>
              <td style={{ padding: '7px 6px', fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                {team.name}
              </td>
              <td style={{ padding: '7px 6px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-sec)' }}>
                {team.played}
              </td>
              <td style={{ padding: '7px 6px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-sec)' }}>
                {team.gd > 0 ? `+${team.gd}` : team.gd}
              </td>
              <td style={{ padding: '7px 6px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>
                {team.pts}
              </td>
              <td style={{ padding: '7px 6px' }}>
                <span style={{ display: 'flex', gap: 3, justifyContent: 'center', alignItems: 'center' }}>
                  {team.form.split('').map((r, j) => <FormDot key={j} result={r} />)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', background: 'var(--card-alt)' }}>
        <a href={href} style={{
          fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'var(--red)', textDecoration: 'none',
        }}>
          Full table →
        </a>
      </div>
    </div>
  )
}
