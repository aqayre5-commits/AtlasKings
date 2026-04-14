'use client'

/**
 * Groups panel v2 — redesigned from the ground up.
 *
 * Visual hierarchy:
 *   • Morocco Group C pinned first, visually enlarged (two-column
 *     card on desktop while others are single-column)
 *   • Every group card has a flag strip header with the 4 team flags
 *     and a per-group progress ring (predicted / 6 matches)
 *   • Match cards are the unified <MatchPredictionCard> primitive:
 *     click a team row to pick the winner, edit exact scores inline,
 *     clear to reset
 *   • Live standings table renders below each group's match grid
 *     with a "Q" badge on qualifying teams (top 2 automatic, best-3rd
 *     contenders surfaced separately in the best-3rd step)
 *
 * Data sources:
 *   • Canonical `GROUPS` / `countryFlagUrl` / `teamNameFromCode`
 *     from `lib/data/wc2026.ts`
 *   • `state.groups[i].matches` for fixture metadata (venue, city,
 *     matchNumber, home/away codes)
 *   • `state.standings[letter]` for ranked rows
 *   • `state.groupResults` for current predictions
 *
 * Dispatches:
 *   • SET_GROUP_RESULT when a score changes
 *   • SIMULATE_GROUPS from the per-card "simulate group" button
 */

import { useMemo } from 'react'
import type { SimulatorStateV2, SimActionV2 } from '@/lib/simulator/v2/types'
import type { SimGroup, GroupStandingRow } from '@/lib/simulator/groups'
import { countryFlagUrl, MOROCCO_GROUP_LETTER } from '@/lib/data/wc2026'
import { matchProbabilitiesByCode } from '@/lib/simulator/strength'
import { getTranslations, type Translations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'
import { ShareAsImage } from '@/components/ui/ShareAsImage'
import { MatchPredictionCard } from './MatchPredictionCard'

type GroupCopy = Translations['simulator']['groups']

interface Props {
  state: SimulatorStateV2
  dispatch: React.Dispatch<SimActionV2>
  lang: 'en' | 'ar' | 'fr'
}

export function GroupsPanelV2({ state, dispatch, lang }: Props) {
  const t = getTranslations(lang as Lang).simulator.groups

  // Morocco's group is rendered first in its own hero block.
  const [moroccoGroup, otherGroups] = useMemo(() => {
    const morocco = state.groups.find(g => g.letter === MOROCCO_GROUP_LETTER)
    const others = state.groups.filter(g => g.letter !== MOROCCO_GROUP_LETTER)
    return [morocco, others] as const
  }, [state.groups])

  const handleChange = (matchNumber: number, home: number, away: number) => {
    dispatch({ type: 'SET_GROUP_RESULT', matchNumber, home, away })
  }
  const handleClear = (matchNumber: number) => {
    // A cleared prediction is stored as an intentional null. The
    // reducer treats "no entry" as un-simulated, so dispatching
    // SET_GROUP_RESULT with -1/-1 would be wrong. Instead we read
    // the full results map back out and re-dispatch LOAD_STATE with
    // the key removed — side-effect free and idempotent.
    const next = { ...state.groupResults }
    delete next[matchNumber]
    dispatch({ type: 'LOAD_STATE', state: { groupResults: next } })
    // Nudge the reducer to re-derive standings from the new map.
    const firstRemaining = Object.keys(next).map(Number)[0]
    if (firstRemaining !== undefined) {
      const r = next[firstRemaining]
      dispatch({ type: 'SET_GROUP_RESULT', matchNumber: firstRemaining, home: r.home, away: r.away })
    }
  }

  return (
    <div style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          color: 'var(--text-faint)',
          marginBottom: 16,
          textAlign: lang === 'ar' ? 'right' : 'left',
        }}
      >
        {t.teamsAdvance}
      </div>

      {/* Morocco group hero */}
      {moroccoGroup && (
        <div style={{ marginBottom: 28 }}>
          <GroupCard
            group={moroccoGroup}
            standings={state.standings[moroccoGroup.letter] ?? []}
            results={state.groupResults}
            onChange={handleChange}
            onClear={handleClear}
            onSimulate={() => dispatch({ type: 'SIMULATE_GROUPS' })}
            chaosFactor={state.chaosFactor}
            strengthModel={state.strengthModel}
            advanceOdds={state.groupsAdvanceOdds}
            isMoroccoHero
            copy={t}
          />
        </div>
      )}

      {/* Other groups — responsive 2-column grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: 20,
        }}
      >
        {otherGroups.map(g => (
          <GroupCard
            key={g.letter}
            group={g}
            standings={state.standings[g.letter] ?? []}
            results={state.groupResults}
            onChange={handleChange}
            onClear={handleClear}
            onSimulate={() => dispatch({ type: 'SIMULATE_GROUPS' })}
            chaosFactor={state.chaosFactor}
            strengthModel={state.strengthModel}
            advanceOdds={state.groupsAdvanceOdds}
            copy={t}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Group card ─────────────────────────────────────────────────

interface GroupCardProps {
  group: SimGroup
  standings: GroupStandingRow[]
  results: Record<number, { home: number; away: number }>
  onChange: (matchNumber: number, home: number, away: number) => void
  onClear: (matchNumber: number) => void
  onSimulate: () => void
  /** Chaos factor for the pre-MC per-match probability preview. */
  chaosFactor: number
  /** Strength model selector (forwarded to matchProbabilitiesByCode). */
  strengthModel: SimulatorStateV2['strengthModel']
  /**
   * Per-team reach-R32 probability from the last Monte Carlo run.
   * When present, the standings table renders an extra "Advance"
   * column showing each team's chance to qualify.
   */
  advanceOdds: Record<string, number> | null
  isMoroccoHero?: boolean
  copy: GroupCopy
}

function GroupCard({
  group,
  standings,
  results,
  onChange,
  onClear,
  chaosFactor,
  strengthModel,
  advanceOdds,
  isMoroccoHero,
  copy,
}: GroupCardProps) {
  // Pre-compute per-match probabilities once per render. These
  // drive the thin 3-segment probability bar inside every
  // MatchPredictionCard so users can see the model's opinion
  // ("BRA 52% / draw 25% / MAR 23%") before deciding their pick.
  const matchProbs = useMemo(() => {
    const map = new Map<number, { home: number; draw: number; away: number }>()
    for (const m of group.matches) {
      const p = matchProbabilitiesByCode(m.homeCode, m.awayCode, {
        chaos: chaosFactor,
        model: strengthModel,
      })
      if (p) {
        map.set(m.matchNumber, {
          home: p.pHome * 100,
          draw: p.pDraw * 100,
          away: p.pAway * 100,
        })
      }
    }
    return map
  }, [group.matches, chaosFactor, strengthModel])
  const predictedCount = group.matches.filter(m => results[m.matchNumber] !== undefined).length
  const totalMatches = group.matches.length
  const progress = totalMatches > 0 ? predictedCount / totalMatches : 0

  return (
    <section
      id={isMoroccoHero ? 'group-c-card' : undefined}
      aria-label={`Group ${group.letter}`}
      style={{
        background: 'var(--card)',
        border: isMoroccoHero ? '2px solid var(--green, #0a5229)' : '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: isMoroccoHero ? '0 0 0 3px rgba(10, 82, 41, 0.12)' : undefined,
      }}
    >
      {/* Header strip */}
      <header
        style={{
          padding: '14px 16px',
          background: isMoroccoHero
            ? 'linear-gradient(135deg, rgba(10, 82, 41, 0.15), rgba(10, 82, 41, 0.02))'
            : 'var(--card-alt)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            minWidth: 100,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 4,
              height: 20,
              background: isMoroccoHero ? 'var(--green)' : 'var(--green-light, #3ecc78)',
              borderRadius: 2,
            }}
          />
          <h3
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: isMoroccoHero ? 18 : 15,
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text)',
              margin: 0,
            }}
          >
            Group {group.letter}
          </h3>
        </div>

        {/* Flag strip */}
        <div style={{ display: 'flex', gap: 6, flex: 1 }}>
          {group.teams.map(t => (
            <img
              key={t.code}
              src={countryFlagUrl(t.code, 40)}
              alt={t.name}
              title={t.name}
              width={28}
              height={18}
              loading="lazy"
              style={{
                objectFit: 'cover',
                borderRadius: 2,
                boxShadow: '0 0 0 1px rgba(0,0,0,0.12)',
                opacity: t.code === 'MAR' ? 1 : 0.9,
              }}
            />
          ))}
        </div>

        {/* Progress indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 90,
              height: 6,
              background: 'var(--card-alt)',
              borderRadius: 999,
              overflow: 'hidden',
              border: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                width: `${progress * 100}%`,
                height: '100%',
                background: progress === 1 ? 'var(--green)' : 'var(--green-light, #3ecc78)',
                transition: 'width 240ms ease',
              }}
            />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--text-sec)',
              minWidth: 34,
              textAlign: 'end',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {predictedCount}/{totalMatches}
          </span>
        </div>
      </header>

      {/* Match grid */}
      <div
        style={{
          padding: 14,
          display: 'grid',
          gridTemplateColumns: isMoroccoHero
            ? 'repeat(auto-fill, minmax(280px, 1fr))'
            : 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 12,
        }}
      >
        {group.matches.map(m => {
          const result = results[m.matchNumber]
          const venueStr = `${formatDate(m.date)} · ${m.city}`
          const probs = matchProbs.get(m.matchNumber)
          return (
            <MatchPredictionCard
              key={m.matchNumber}
              matchNumber={m.matchNumber}
              homeCode={m.homeCode}
              awayCode={m.awayCode}
              homeScore={result?.home ?? null}
              awayScore={result?.away ?? null}
              subhead={venueStr}
              variant="group"
              onChange={onChange}
              onClear={onClear}
              probabilities={probs}
              highlight={m.homeCode === 'MAR' || m.awayCode === 'MAR'}
            />
          )
        })}
      </div>

      {/* Standings table */}
      {standings.length > 0 && (
        <div
          style={{
            borderTop: '1px solid var(--border)',
            padding: '12px 16px 16px',
            background: 'var(--card-alt)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-head)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-faint)',
              }}
            >
              {copy.standings}
            </span>
            {isMoroccoHero && standings.length > 0 && (
              <ShareAsImage
                targetSelector="#group-c-card"
                caption={`My Group C prediction - Morocco WC 2026`}
                variant="icon"
              />
            )}
          </div>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: 'var(--font-body)',
            }}
          >
            <thead>
              <tr>
                <Th align="center">{copy.headers.pos}</Th>
                <Th align="start">{copy.headers.team}</Th>
                <Th align="center">{copy.headers.p}</Th>
                <Th align="center">{copy.headers.w}</Th>
                <Th align="center">{copy.headers.d}</Th>
                <Th align="center">{copy.headers.l}</Th>
                <Th align="center">{copy.headers.gd}</Th>
                <Th align="center">{copy.headers.pts}</Th>
                {advanceOdds && <Th align="center">ADV%</Th>}
              </tr>
            </thead>
            <tbody>
              {standings.map((row, idx) => {
                const rank = idx + 1
                const qualifies = rank <= 2
                const isMorocco = row.team.code === 'MAR'
                const adv = advanceOdds?.[row.team.code]
                return (
                  <tr
                    key={row.team.code}
                    style={{
                      borderTop: '1px solid var(--border)',
                      background: isMorocco ? 'rgba(10, 82, 41, 0.06)' : 'transparent',
                    }}
                  >
                    <Td align="center">
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 18,
                          height: 18,
                          borderRadius: 4,
                          background: qualifies ? 'var(--green)' : 'transparent',
                          color: qualifies ? '#fff' : 'var(--text-faint)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {rank}
                      </span>
                    </Td>
                    <Td align="start">
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          fontFamily: 'var(--font-head)',
                          fontSize: 12,
                          fontWeight: 700,
                          color: 'var(--text)',
                        }}
                      >
                        <img
                          src={countryFlagUrl(row.team.code, 40)}
                          alt=""
                          width={20}
                          height={14}
                          loading="lazy"
                          style={{
                            objectFit: 'cover',
                            borderRadius: 2,
                            boxShadow: '0 0 0 1px rgba(0,0,0,0.12)',
                          }}
                        />
                        {row.team.name}
                      </span>
                    </Td>
                    <Td align="center">{row.played}</Td>
                    <Td align="center">{row.won}</Td>
                    <Td align="center">{row.drawn}</Td>
                    <Td align="center">{row.lost}</Td>
                    <Td align="center">
                      {row.gd > 0 ? `+${row.gd}` : row.gd}
                    </Td>
                    <Td align="center" bold>
                      {row.points}
                    </Td>
                    {advanceOdds && (
                      <Td align="center">
                        {adv !== undefined ? (
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 11,
                              fontWeight: 700,
                              color:
                                adv >= 70
                                  ? 'var(--green)'
                                  : adv >= 40
                                    ? 'var(--text)'
                                    : 'var(--text-faint)',
                            }}
                            title={`Monte Carlo advance probability: ${adv.toFixed(1)}%`}
                          >
                            {adv.toFixed(0)}%
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-faint)' }}>—</span>
                        )}
                      </Td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

// ─── Tiny table helpers ─────────────────────────────────────────

function Th({ children, align }: { children: React.ReactNode; align: 'start' | 'center' }) {
  return (
    <th
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: 'var(--text-faint)',
        textAlign: align,
        padding: '4px 6px',
      }}
    >
      {children}
    </th>
  )
}

function Td({
  children,
  align,
  bold,
}: {
  children: React.ReactNode
  align: 'start' | 'center'
  bold?: boolean
}) {
  return (
    <td
      style={{
        fontFamily: bold ? 'var(--font-head)' : 'var(--font-mono)',
        fontSize: bold ? 13 : 12,
        fontWeight: bold ? 800 : 600,
        color: 'var(--text)',
        textAlign: align,
        padding: '6px 6px',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {children}
    </td>
  )
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso + 'T18:00:00')
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  } catch {
    return iso
  }
}
