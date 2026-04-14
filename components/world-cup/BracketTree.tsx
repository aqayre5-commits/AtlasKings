import Link from 'next/link'
import { TeamLogo } from '@/components/ui/TeamLogo'
import type { BracketMatch, StageKey } from '@/types/world-cup'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'

interface Props {
  matches: BracketMatch[]
  langPrefix: string
  /** Locale for stage-label translations. Defaults to 'en'. */
  lang?: Lang
}

const STAGE_ORDER: Record<StageKey, number> = {
  group: 0,
  r32: 1,
  r16: 2,
  qf: 3,
  sf: 4,
  bronze: 5,
  final: 6,
}

function BracketMatchCard({ match, langPrefix }: { match: BracketMatch; langPrefix: string }) {
  const hasTeams = match.homeTeam || match.awayTeam

  const card = (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      minWidth: 220,
      transition: 'border-color 0.15s',
    }}>
      {/* Home / Slot A */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        borderBottom: '1px solid var(--border)',
      }}>
        {match.homeTeam ? (
          <TeamLogo src={match.homeTeam.flagUrl} alt={match.homeTeam.name} size={18} />
        ) : (
          <div style={{ width: 18, height: 18, borderRadius: 2, background: 'var(--card-alt)', flexShrink: 0 }} />
        )}
        <span style={{
          fontFamily: 'var(--font-head)',
          fontSize: 12,
          fontWeight: 700,
          color: match.homeTeam ? 'var(--text)' : 'var(--text-faint)',
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {match.homeTeam?.name || match.homeLabel}
        </span>
        {match.winnerTeamId != null && match.homeTeam && (
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            fontWeight: 700,
            color: match.winnerTeamId === match.homeTeam.id ? 'var(--text)' : 'var(--text-faint)',
          }}>
            {/* Score placeholder since BracketMatch doesn't have scores */}
          </span>
        )}
      </div>

      {/* Away / Slot B */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
      }}>
        {match.awayTeam ? (
          <TeamLogo src={match.awayTeam.flagUrl} alt={match.awayTeam.name} size={18} />
        ) : (
          <div style={{ width: 18, height: 18, borderRadius: 2, background: 'var(--card-alt)', flexShrink: 0 }} />
        )}
        <span style={{
          fontFamily: 'var(--font-head)',
          fontSize: 12,
          fontWeight: 700,
          color: match.awayTeam ? 'var(--text)' : 'var(--text-faint)',
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {match.awayTeam?.name || match.awayLabel}
        </span>
      </div>

      {/* Status bar */}
      <div style={{
        padding: '4px 12px',
        background: 'var(--card-alt)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)' }}>
          {match.venue}, {match.city}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--green)', fontWeight: 700 }}>
          {match.slotLabel}
        </span>
      </div>
    </div>
  )

  if (hasTeams) {
    return (
      <Link
        href={`${langPrefix}/world-cup/matches/${match.id}`}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      >
        {card}
      </Link>
    )
  }

  return card
}

export function BracketTree({ matches, langPrefix, lang = 'en' }: Props) {
  const t = getTranslations(lang)
  const stageLabel = (stage: StageKey): string => {
    switch (stage) {
      case 'group':  return t.sections?.stageGroup ?? 'Group Stage'
      case 'r32':    return t.sections?.stageR32 ?? 'Round of 32'
      case 'r16':    return t.sections?.stageR16 ?? 'Round of 16'
      case 'qf':     return t.sections?.stageQF ?? 'Quarter-Finals'
      case 'sf':     return t.sections?.stageSF ?? 'Semi-Finals'
      case 'bronze': return t.sections?.stageBronze ?? 'Third Place'
      case 'final':  return t.sections?.stageFinal ?? 'Final'
      default: return stage
    }
  }
  if (matches.length === 0) {
    return (
      <div style={{
        padding: '48px 20px',
        textAlign: 'center',
        fontFamily: 'var(--font-head)',
        fontSize: 14,
        color: 'var(--text-faint)',
      }}>
        Bracket not yet available.
      </div>
    )
  }

  // Group matches by stage
  const stageGroups = new Map<StageKey, BracketMatch[]>()
  for (const m of matches) {
    const existing = stageGroups.get(m.stage) || []
    existing.push(m)
    stageGroups.set(m.stage, existing)
  }

  // Sort stages by order, then matches within each stage by roundOrder
  const sortedStages = Array.from(stageGroups.entries())
    .sort(([a], [b]) => (STAGE_ORDER[a] ?? 99) - (STAGE_ORDER[b] ?? 99))

  return (
    <div className="bracket-container" style={{
      display: 'flex',
      gap: 16,
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
      paddingBottom: 12,
      scrollbarWidth: 'none',
    }}>
      {sortedStages.map(([stage, stageMatches]) => (
        <div key={stage} style={{ flexShrink: 0, minWidth: 230 }}>
          <h3 style={{
            fontFamily: 'var(--font-head)',
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--text)',
            textAlign: 'center',
            marginBottom: 12,
            paddingBottom: 8,
            borderBottom: '2px solid var(--green)',
          }}>
            {stageLabel(stage)}
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            justifyContent: 'space-around',
            minHeight: stage === 'final' || stage === 'bronze' ? 'auto' : '100%',
          }}>
            {stageMatches
              .sort((a, b) => a.roundOrder - b.roundOrder)
              .map(match => (
                <BracketMatchCard key={match.id} match={match} langPrefix={langPrefix} />
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
