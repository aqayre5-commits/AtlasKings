import Link from 'next/link'
import { TeamLogo } from '@/components/ui/TeamLogo'
import type { MatchData } from '@/lib/api-football/fixtures'

interface BracketRound {
  round: string
  matches: MatchData[]
}

interface Props {
  rounds: BracketRound[]
  langPrefix: string
}

// Order rounds from earliest to latest
const ROUND_ORDER = ['Round of 16', '8th Finals', 'Quarter-finals', 'Semi-finals', 'Final']

function getRoundOrder(name: string): number {
  const idx = ROUND_ORDER.findIndex(r => name.toLowerCase().includes(r.toLowerCase()))
  return idx >= 0 ? idx : 99
}

function BracketMatchCard({ match, langPrefix }: { match: MatchData; langPrefix: string }) {
  const status = match.status as string
  const isDone = status === 'FT' || status === 'AET' || status === 'PEN'
  const isLive = status === 'LIVE' || status === 'HT' || status === '1H' || status === '2H'
  const homeWon = isDone && (match.home.score ?? 0) > (match.away.score ?? 0)
  const awayWon = isDone && (match.away.score ?? 0) > (match.home.score ?? 0)

  return (
    <Link href={`${langPrefix}/matches/${match.id}`} style={{
      display: 'block', textDecoration: 'none', color: 'inherit',
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', overflow: 'hidden',
      minWidth: 220, transition: 'border-color 0.15s',
    }}>
      {/* Home team */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
        borderBottom: '1px solid var(--border)',
        fontWeight: homeWon ? 800 : 500,
      }}>
        <TeamLogo src={match.home.logo} alt={match.home.name} size={18} />
        <span style={{
          fontFamily: 'var(--font-head)', fontSize: 12, color: homeWon ? 'var(--text)' : 'var(--text-sec)',
          flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {match.home.name}
        </span>
        {isDone && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: homeWon ? 'var(--text)' : 'var(--text-faint)' }}>
            {match.home.score}
          </span>
        )}
      </div>

      {/* Away team */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
        fontWeight: awayWon ? 800 : 500,
      }}>
        <TeamLogo src={match.away.logo} alt={match.away.name} size={18} />
        <span style={{
          fontFamily: 'var(--font-head)', fontSize: 12, color: awayWon ? 'var(--text)' : 'var(--text-sec)',
          flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {match.away.name}
        </span>
        {isDone && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: awayWon ? 'var(--text)' : 'var(--text-faint)' }}>
            {match.away.score}
          </span>
        )}
      </div>

      {/* Status bar */}
      <div style={{
        padding: '4px 12px', background: 'var(--card-alt)', borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-faint)' }}>
          {match.date}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
          color: isLive ? 'var(--live)' : isDone ? 'var(--text-faint)' : 'var(--green)',
        }}>
          {isLive ? `LIVE ${match.time}` : isDone ? match.status : match.time}
        </span>
      </div>
    </Link>
  )
}

export function UclBracket({ rounds, langPrefix }: Props) {
  const sortedRounds = [...rounds].sort((a, b) => getRoundOrder(a.round) - getRoundOrder(b.round))

  if (sortedRounds.length === 0) {
    return (
      <div style={{ padding: '48px 20px', textAlign: 'center', fontFamily: 'var(--font-head)', fontSize: 14, color: 'var(--text-faint)' }}>
        No knockout matches yet.
      </div>
    )
  }

  return (
    <section aria-label="Bracket" className="bracket-container">
      {sortedRounds.map(round => (
        <div key={round.round} className="bracket-column">
          <h3 style={{
            fontFamily: 'var(--font-head)', fontSize: 11, fontWeight: 800,
            letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text)',
            textAlign: 'center', marginBottom: 12, paddingBottom: 8,
            borderBottom: '2px solid var(--navy)',
          }}>
            {round.round}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {round.matches.map(match => (
              <BracketMatchCard key={match.id} match={match} langPrefix={langPrefix} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
