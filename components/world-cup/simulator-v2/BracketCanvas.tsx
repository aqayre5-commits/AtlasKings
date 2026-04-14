'use client'

/**
 * Bracket canvas — symmetric tournament layout.
 *
 * Matches the visual grammar of the 2026worldcupsim.com reference
 * image the user approved, but in Atlas Kings' LIGHT palette:
 *
 *     R32  R16  QF  SF      [TROPHY]     SF  QF  R16  R32
 *     73 ┐                    ▲                   ┌ 81
 *     74 ┘ 89 ┐               │               ┌ 93 └ 82
 *     75 ┐   ┘ 97 ┐           │           ┌ 99 ┘   ┌ 83
 *     76 ┘ 90 ┘   ┘ 101 ┐   [FINAL]   ┌ 102 ┘ 100 ┘ └ 84
 *     77 ┐        ┐     │   [match]   │       ┐      ┌ 85
 *     78 ┘ 91 ┐    ┘    │  (103)┏━━━┓ │      ┌ 95 ┘   └ 86
 *     79 ┐   ┘ 98 ┐     └───────▶┃104┃ ┘     ┐         ┌ 87
 *     80 ┘ 92 ┘           103    ┗━━━┛        96 ┘     └ 88
 *
 * The layout splits into three flex children:
 *   1. Left half  — 4 flex columns (R32|R16|QF|SF) flowing right
 *   2. Centre     — stacked trophy + champion badge + final card +
 *                   bronze card
 *   3. Right half — mirror of (1), flowing left
 *
 * Each round column is a plain flex column with `justify-content:
 * space-around`, so cards self-distribute vertically. CSS pseudo-
 * elements on every card draw horizontal + vertical connector
 * segments — no SVG overlay, no measurement, no ResizeObserver.
 *
 * The match card primitive (<BracketCard>) is compact: ~60 px tall,
 * two team rows, click-to-advance, optional pens row. It's defined
 * inline at the bottom of this file so we don't need to export it.
 */

import React, { useMemo, useState, useRef, useCallback } from 'react'
import { getFeedsSlot, type KnockoutSlot } from '@/lib/simulator/knockout'
import type { SimTeam } from '@/lib/simulator/groups'
import type { MonteCarloResults, SimulatorStateV2 } from '@/lib/simulator/v2/types'
import { countryFlagUrl, teamNameFromCode } from '@/lib/data/wc2026'
import { encodeStateV2 } from '@/lib/simulator/v2/state'
import { getTranslations, type Translations } from '@/lib/i18n/translations'

type BracketCopy = Translations['simulator']['bracket']
import type { Lang } from '@/lib/i18n/config'

interface Props {
  knockout: KnockoutSlot[]
  onSelectWinner: (matchNumber: number, winner: SimTeam) => void
  montecarlo: MonteCarloResults | null
  lang: 'en' | 'ar' | 'fr'
  groupsComplete: boolean
  simulatorState?: SimulatorStateV2
  /** Callback to trigger knockout simulation from the bracket toolbar. */
  onSimulateKnockout?: () => void
  /** Action buttons rendered in the centre column above the trophy. */
  actionButtons?: React.ReactNode
}

export function BracketCanvas({
  knockout,
  onSelectWinner,
  montecarlo,
  lang,
  groupsComplete,
  simulatorState,
  onSimulateKnockout,
  actionButtons,
}: Props) {
  const t = getTranslations(lang as Lang).simulator.bracket
  const isRTL = lang === 'ar'

  const sliced = useMemo(() => splitKnockoutIntoHalves(knockout), [knockout])
  const moroccoPath = useMemo(() => computeMoroccoPath(knockout), [knockout])

  const [activeMobileStage, setActiveMobileStage] = useState<'r32' | 'r16' | 'qf' | 'sf' | 'final'>('r32')

  // ── Zoom state ──
  const [zoom, setZoom] = useState(1)
  const scrollRef = useRef<HTMLDivElement>(null)
  const bracketRef = useRef<HTMLDivElement>(null)

  const zoomIn = useCallback(() => setZoom(z => Math.min(z + 0.1, 1.5)), [])
  const zoomOut = useCallback(() => setZoom(z => Math.max(z - 0.1, 0.3)), [])
  const zoomFit = useCallback(() => {
    if (!scrollRef.current || !bracketRef.current) return
    const containerW = scrollRef.current.clientWidth
    const bracketW = bracketRef.current.scrollWidth
    if (bracketW > 0) setZoom(Math.min(containerW / bracketW, 1))
  }, [])

  // ── Share handler ──
  const [shareToast, setShareToast] = useState(false)
  const handleShare = useCallback(async () => {
    if (!simulatorState) return
    const encoded = encodeStateV2(simulatorState)
    const langPrefix = lang === 'en' ? '' : `/${lang}`
    const url = `${window.location.origin}${langPrefix}/wc-2026/predictor?p=${encoded}`

    // WhatsApp share — primary for mobile (Morocco audience)
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent)
    if (isMobile) {
      const waText = encodeURIComponent(`My FIFA World Cup 2026 Bracket\n${url}`)
      window.open(`https://wa.me/?text=${waText}`, '_blank')
      return
    }

    if (navigator.share) {
      try {
        await navigator.share({ title: 'My FIFA World Cup 2026 Bracket', url })
        return
      } catch { /* user cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(url)
      setShareToast(true)
      setTimeout(() => setShareToast(false), 2500)
    } catch {
      // Fallback: select-all prompt
      window.prompt('Copy this link:', url)
    }
  }, [simulatorState, lang])

  const champion = sliced.final?.winner ?? null
  const thirdPlace = sliced.bronze?.winner ?? null

  const handlePick = (matchNumber: number, winnerCode: string) => {
    // Gate: no knockout interaction allowed until the group stage
    // is complete. Spec: "You can only simulate/manual if you have
    // already done group results."
    if (!groupsComplete) return
    const slot = knockout.find(m => m.matchNumber === matchNumber)
    if (!slot) return
    const winner =
      slot.homeTeam?.code === winnerCode
        ? slot.homeTeam
        : slot.awayTeam?.code === winnerCode
          ? slot.awayTeam
          : null
    if (winner) onSelectWinner(matchNumber, winner)
  }

  const cardProps = {
    onPick: handlePick,
    moroccoPath,
    montecarlo,
    pensLabel: t.pens,
  }

  return (
    <div style={{ direction: 'ltr' }}>
      {/* Locked-state banner shown pre-groups. The bracket below
          still renders the placeholder labels (1A / 3ACDL / etc.)
          so users can see the structure, but clicks are no-ops
          and there is no simulate button. */}
      {!groupsComplete && (
        <div
          style={{
            padding: '14px 18px',
            marginBottom: 18,
            background: 'linear-gradient(135deg, rgba(193, 18, 31, 0.06), rgba(230, 180, 80, 0.04))',
            border: '1px dashed var(--border)',
            borderRadius: 'var(--radius)',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <span style={{ fontSize: 22 }} aria-hidden="true">
            🔒
          </span>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: 'var(--font-head)',
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text)',
                marginBottom: 2,
              }}
            >
              {t.locked}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                color: 'var(--text-sec)',
                lineHeight: 1.5,
              }}
            >
              {t.lockedDesc}
            </div>
          </div>
        </div>
      )}

      {/* Desktop symmetric bracket.
          Scroll container: wraps the flex row so the user can
          drag or swipe horizontally when the bracket is wider
          than the viewport. Scroll snap is applied to the inner
          element so the scrollbar still reflects real bracket
          width. */}
      <div
        ref={scrollRef}
        className="bracket-desktop"
        style={{
          overflowX: 'auto',
          overflowY: 'visible',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div
          ref={bracketRef}
          className="bracket-flex"
          style={{
            display: 'inline-flex',
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            gap: 0,
            padding: '36px 24px 24px',
            minHeight: 920 * zoom,
            minWidth: 'max-content',
            transform: zoom !== 1 ? `scale(${zoom})` : undefined,
            transformOrigin: 'top left',
          }}
        >
          {/* LEFT HALF — R32 → R16 → QF → SF (SF back in the half) */}
          <BracketHalf
            side="left"
            copy={t}
            columns={{
              r32: sliced.leftR32,
              r16: sliced.leftR16,
              qf: sliced.leftQF,
              sf: sliced.leftSF ? [sliced.leftSF] : [],
            }}
            {...cardProps}
          />

          {/* CENTER — Title + toolbar + trophy + champion + Final + Bronze */}
          <CentreColumn
            final={sliced.final}
            bronze={sliced.bronze}
            champion={champion}
            copy={t}
            cardProps={cardProps}
            header={
              <>
                {/* Action buttons — centred above trophy */}
                {actionButtons}
                <h1
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontSize: 16,
                    fontWeight: 900,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--text)',
                    textAlign: 'center',
                    margin: 0,
                    lineHeight: 1.1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t.title}
                </h1>
              </>
            }
          />

          {/* RIGHT HALF — R32 → R16 → QF → SF */}
          <BracketHalf
            side="right"
            copy={t}
            columns={{
              r32: sliced.rightR32,
              r16: sliced.rightR16,
              qf: sliced.rightQF,
              sf: sliced.rightSF ? [sliced.rightSF] : [],
            }}
            {...cardProps}
          />
        </div>
      </div>

      {/* Mobile stage carousel */}
      <div className="bracket-mobile" style={{ display: 'none' }}>
        <MobileTrophy
          champion={champion}
          thirdPlace={thirdPlace}
          copy={t}
        />
        <div
          style={{
            display: 'flex',
            gap: 6,
            padding: 4,
            margin: '14px 0 12px',
            background: 'var(--card-alt)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            overflowX: 'auto',
          }}
        >
          {(['r32', 'r16', 'qf', 'sf', 'final'] as const).map(stage => {
            const active = stage === activeMobileStage
            return (
              <button
                key={`m-tab-${stage}`}
                onClick={() => setActiveMobileStage(stage)}
                style={{
                  flex: '1 0 auto',
                  padding: '8px 12px',
                  background: active ? 'var(--green)' : 'transparent',
                  color: active ? '#fff' : 'var(--text-sec)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-head)',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
              >
                {t[stage]}
              </button>
            )
          })}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 10,
          }}
        >
          {mobileStageMatches(activeMobileStage, sliced).map(slot => (
            <BracketCard
              key={`m-${slot.matchNumber}`}
              slot={slot}
              moroccoPath={moroccoPath}
              montecarlo={montecarlo}
              onPick={handlePick}
              pensLabel={t.pens}
              mobile
            />
          ))}
        </div>
        {sliced.bronze && activeMobileStage === 'final' && (
          <div style={{ marginTop: 18 }}>
            <div
              style={{
                fontFamily: 'var(--font-head)',
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-faint)',
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#cd7f32',
                }}
              />
              {t.bronze}
            </div>
            <BracketCard
              slot={sliced.bronze}
              moroccoPath={moroccoPath}
              montecarlo={montecarlo}
              onPick={handlePick}
              pensLabel={t.pens}
              mobile
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 1100px) {
          :global(.bracket-desktop) {
            display: none !important;
          }
          :global(.bracket-mobile) {
            display: block !important;
          }
        }
        @media print {
          :global(.site-header),
          :global(.site-footer),
          :global(header),
          :global(footer),
          :global(nav),
          :global(.sim-controls),
          :global(.bracket-mobile),
          :global(.bracket-toolbar),
          :global([class*="ticker"]),
          :global([class*="skip"]) {
            display: none !important;
          }
          :global(body) {
            background: #fff !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          :global(#main-content),
          :global(main),
          :global(.page-wrap) {
            padding: 0 !important;
            margin: 0 !important;
          }
          :global(.bracket-desktop) {
            display: block !important;
            overflow: visible !important;
          }
          :global(.bracket-flex) {
            /* zoom (not transform) so the layout box actually shrinks
               to fit one A4 landscape page. transform: scale() only
               changes visuals, leaving the original box height in
               the flow and causing a page break. */
            zoom: 0.52 !important;
            transform: none !important;
            min-height: auto !important;
            padding: 4px !important;
          }
          :global(h1) {
            font-size: 12px !important;
            margin: 0 0 2px !important;
          }
        }
        @page {
          size: landscape;
          margin: 6mm;
        }
      `}</style>
    </div>
  )
}

// ─── Toolbar button ────────────────────────────────────────────

function ToolbarBtn({
  label,
  onClick,
  title,
  wide,
  accent,
}: {
  label: string
  onClick: () => void
  title?: string
  wide?: boolean
  accent?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: wide ? 'auto' : 28,
        height: 28,
        padding: wide ? '0 12px' : '0 6px',
        background: accent ? 'var(--green)' : 'transparent',
        color: accent ? '#fff' : 'var(--text)',
        border: accent ? 'none' : '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        fontFamily: 'var(--font-head)',
        fontSize: 11,
        fontWeight: 700,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'background 150ms ease',
      }}
    >
      {label}
    </button>
  )
}

// ─── Splitting & Morocco path helpers ──────────────────────────

// ─── Bracket-ordered halving ───────────────────────────────────
//
// Walk the feedsInto chain backwards from each semi-final to
// produce top-to-bottom bracket order for every round within a
// half. Each child's feeders are sorted by their FEEDS_SLOT
// value (home first, away second) so that:
//
//   • The pair of R32 matches that feed a given R16 ends up
//     adjacent, with the home-slot feeder on top.
//   • Likewise for R16 → QF and QF → SF.
//
// This makes the pair-top/pair-bottom CSS classes produce
// vertical connector lines that actually point at the correct
// next-round card, which was not the case under the previous
// numeric-sort approach (where 73 ended up adjacent to 74 even
// though they feed different R16s under v17 routing).
function feedersOf(knockout: KnockoutSlot[], targetMatchNumber: number): KnockoutSlot[] {
  return knockout
    .filter(m => m.feedsInto === targetMatchNumber)
    .sort((a, b) => {
      const sa = getFeedsSlot(a.matchNumber)
      const sb = getFeedsSlot(b.matchNumber)
      if (sa !== sb) return sa === 'home' ? -1 : 1
      return a.matchNumber - b.matchNumber
    })
}

function bracketOrderedHalf(knockout: KnockoutSlot[], sfMatchNumber: number) {
  const sf = knockout.find(m => m.matchNumber === sfMatchNumber) ?? null
  const qf = sf ? feedersOf(knockout, sfMatchNumber).filter(m => m.stage === 'qf') : []

  const r16: KnockoutSlot[] = []
  for (const qMatch of qf) {
    for (const rMatch of feedersOf(knockout, qMatch.matchNumber)) {
      if (rMatch.stage === 'r16') r16.push(rMatch)
    }
  }

  const r32: KnockoutSlot[] = []
  for (const rMatch of r16) {
    for (const r32Match of feedersOf(knockout, rMatch.matchNumber)) {
      if (r32Match.stage === 'r32') r32.push(r32Match)
    }
  }

  return { r32, r16, qf, sf }
}

function splitKnockoutIntoHalves(knockout: KnockoutSlot[]) {
  const left = bracketOrderedHalf(knockout, 101)
  const right = bracketOrderedHalf(knockout, 102)
  const final = knockout.find(m => m.stage === 'final') ?? null
  const bronze = knockout.find(m => m.stage === 'bronze') ?? null

  return {
    leftR32: left.r32,
    rightR32: right.r32,
    leftR16: left.r16,
    rightR16: right.r16,
    leftQF: left.qf,
    rightQF: right.qf,
    leftSF: left.sf,
    rightSF: right.sf,
    final,
    bronze,
  }
}

function computeMoroccoPath(knockout: KnockoutSlot[]): Set<number> {
  const out = new Set<number>()
  const queue: number[] = []
  for (const slot of knockout) {
    if (slot.stage !== 'r32') continue
    if (slot.homeTeam?.code === 'MAR' || slot.awayTeam?.code === 'MAR') {
      queue.push(slot.matchNumber)
    }
  }
  while (queue.length) {
    const n = queue.shift()!
    if (out.has(n)) continue
    const slot = knockout.find(m => m.matchNumber === n)
    if (!slot) continue
    out.add(n)
    const moroccoInSlot =
      slot.homeTeam?.code === 'MAR' || slot.awayTeam?.code === 'MAR'
    const moroccoAdvances = !slot.winner ? moroccoInSlot : slot.winner.code === 'MAR'
    if (moroccoAdvances && slot.feedsInto) queue.push(slot.feedsInto)
  }
  return out
}

function mobileStageMatches(
  stage: 'r32' | 'r16' | 'qf' | 'sf' | 'final',
  sliced: ReturnType<typeof splitKnockoutIntoHalves>,
): KnockoutSlot[] {
  switch (stage) {
    case 'r32':
      return [...sliced.leftR32, ...sliced.rightR32]
    case 'r16':
      return [...sliced.leftR16, ...sliced.rightR16]
    case 'qf':
      return [...sliced.leftQF, ...sliced.rightQF]
    case 'sf':
      return [sliced.leftSF, sliced.rightSF].filter((m): m is KnockoutSlot => !!m)
    case 'final':
      return sliced.final ? [sliced.final] : []
  }
}

// ─── Half (L or R) ─────────────────────────────────────────────

interface BracketHalfProps {
  side: 'left' | 'right'
  columns: {
    r32: KnockoutSlot[]
    r16: KnockoutSlot[]
    qf: KnockoutSlot[]
    sf: KnockoutSlot[]
  }
  copy: BracketCopy
  onPick: (matchNumber: number, winnerCode: string) => void
  moroccoPath: Set<number>
  montecarlo: MonteCarloResults | null
  pensLabel: string
}

function BracketHalf({ side, columns, copy, onPick, moroccoPath, montecarlo, pensLabel }: BracketHalfProps) {
  const labels: Array<{ key: 'r32' | 'r16' | 'qf' | 'sf'; label: string }> = [
    { key: 'r32', label: copy.r32 },
    { key: 'r16', label: copy.r16 },
    { key: 'qf', label: copy.qf },
    { key: 'sf', label: copy.sf },
  ]
  const orderedLabels = side === 'left' ? labels : [...labels].reverse()

  // Which pair indices are on Morocco's path through this half?
  // Used to highlight the corresponding SVG connectors in gold.
  // A pair is "on the path" when one of the two feeder matches
  // eventually advances Morocco.
  function highlightsForStage(
    prevStageKey: 'r32' | 'r16' | 'qf',
  ): Set<number> | undefined {
    const prevMatches = columns[prevStageKey]
    if (prevMatches.length === 0) return undefined
    const out = new Set<number>()
    for (let i = 0; i < prevMatches.length; i += 2) {
      const a = prevMatches[i]
      const b = prevMatches[i + 1]
      if (!a || !b) continue
      if (moroccoPath.has(a.matchNumber) || moroccoPath.has(b.matchNumber)) {
        out.add(i / 2)
      }
    }
    return out.size > 0 ? out : undefined
  }

  return (
    <div
      className={`bracket-half bracket-half-${side}`}
      style={{
        flex: '0 0 auto',
        display: 'flex',
        // Both halves use `row` direction. The right half's
        // columns are REVERSED in the labels array below so the
        // visual order mirrors outward from the centre:
        //
        //   L:  R32 · R16 · QF · SF   [TROPHY]   SF · QF · R16 · R32  :R
        //
        // Between each pair of round columns sits a dedicated
        // ConnectorGutter column which renders the bracket lines
        // as an SVG, ensuring they always point from each feeder
        // pair at their correct target card in the next round.
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: 0,
      }}
    >
      {orderedLabels.map(({ key, label }, idx) => {
        const matches = columns[key]
        const roundColumn = (
          <RoundColumn
            key={`${side}-${key}`}
            side={side}
            stageKey={key}
            label={label}
            matches={matches}
            onPick={onPick}
            moroccoPath={moroccoPath}
            montecarlo={montecarlo}
            pensLabel={pensLabel}
          />
        )

        // After each round column (except the last), insert a
        // connector gutter that draws lines from THIS column's
        // pairs into the NEXT column's cards. prevStageKey is
        // the round whose cards are being paired.
        const nextLabel = orderedLabels[idx + 1]
        if (!nextLabel) return roundColumn

        // On the left half, columns run R32 → R16 → QF → SF and
        // the connectors sit to the right of each round column
        // (linking outward in match-number sense, inward in
        // visual sense toward the trophy).
        //
        // On the right half, columns run SF → QF → R16 → R32 and
        // the connectors need to point from the column that has
        // pairs (the wider column) into the column that has the
        // single target card (the narrower column). The pairs
        // are in the NEXT column, not the current one.
        const pairColumnKey = side === 'left' ? key : nextLabel.key
        const pairMatches = columns[pairColumnKey as 'r32' | 'r16' | 'qf']
        const pairCount = Math.floor(pairMatches.length / 2)
        if (pairCount === 0) return roundColumn

        const highlights = highlightsForStage(
          pairColumnKey as 'r32' | 'r16' | 'qf',
        )

        return (
          <React.Fragment key={`${side}-${key}-frag`}>
            {roundColumn}
            <ConnectorGutter
              pairCount={pairCount}
              side={side}
              highlightedPairs={highlights}
            />
          </React.Fragment>
        )
      })}
    </div>
  )
}

// ─── Round column ──────────────────────────────────────────────

interface RoundColumnProps {
  side: 'left' | 'right'
  stageKey: 'r32' | 'r16' | 'qf' | 'sf'
  label: string
  matches: KnockoutSlot[]
  onPick: (matchNumber: number, winnerCode: string) => void
  moroccoPath: Set<number>
  montecarlo: MonteCarloResults | null
  pensLabel: string
}

function RoundColumn({ side, stageKey, label, matches, onPick, moroccoPath, montecarlo, pensLabel }: RoundColumnProps) {
  const isSF = stageKey === 'sf'
  // Every round column is the same width so the bracket tiers
  // line up cleanly. Connectors live outside the column in
  // dedicated "gutter" columns that BracketHalf renders
  // between each round.
  const minWidth = 154
  return (
    <div
      className={`round round-${stageKey} round-${side}`}
      style={{
        flex: '0 0 auto',
        minWidth,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        padding: '8px 0',
        position: 'relative',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-head)',
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-faint)',
          textAlign: 'center',
          position: 'absolute',
          top: -24,
          left: 0,
          right: 0,
        }}
      >
        {label}
      </div>
      {matches.map(slot => (
        <div
          key={`slot-${slot.matchNumber}`}
          className="round-cell"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 0',
          }}
        >
          <BracketCard
            slot={slot}
            moroccoPath={moroccoPath}
            montecarlo={montecarlo}
            onPick={onPick}
            pensLabel={pensLabel}
          />
        </div>
      ))}
    </div>
  )
}

/**
 * Connector gutter that sits between two round columns. Renders
 * an SVG overlay drawing proper right-angle bracket lines from
 * each pair of cards in the previous round into the single card
 * they feed in the next round.
 *
 * Rendering math: the parent column has N cards distributed by
 * `justify-content: space-around`, which places the cards'
 * vertical centres at fractions (1/(2N), 3/(2N), 5/(2N), …).
 * We replicate that here using the SVG viewBox coordinate
 * system (100 × 100, unscaled) so the pair midpoints line up
 * exactly with the card centres in both columns.
 */
function ConnectorGutter({
  pairCount,
  side,
  highlightedPairs,
}: {
  pairCount: number
  side: 'left' | 'right'
  /** Indices of pair midpoints that should render in gold. */
  highlightedPairs?: Set<number>
}) {
  // Each pair occupies a vertical band of height 2/(2*pairCount)
  // of the column. Inside that band, the top card sits at 1/4
  // and the bottom at 3/4, and the pair's midpoint (which is
  // the target card's centre in the next column) sits at 1/2.
  const cardsInPrev = pairCount * 2
  const bandHeight = 100 / cardsInPrev
  return (
    <div
      style={{
        flex: '0 0 auto',
        width: 42,
        position: 'relative',
        alignSelf: 'stretch',
        // Account for the round column's top padding (8) so the
        // SVG's 0-100 coordinate range maps to the card area
        // rather than to the column including the header strip.
        padding: '8px 0',
      }}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ display: 'block', overflow: 'visible' }}
      >
        {Array.from({ length: pairCount }, (_, pairIdx) => {
          // Top card vertical centre (%)
          const topY = bandHeight * (pairIdx * 2) + bandHeight / 2
          const botY = bandHeight * (pairIdx * 2 + 1) + bandHeight / 2
          const midY = (topY + botY) / 2
          const isHighlighted = highlightedPairs?.has(pairIdx) ?? false
          const stroke = isHighlighted
            ? 'var(--gold, #e6b450)'
            : 'var(--green, #0a5229)'
          const strokeWidth = isHighlighted ? 2.4 : 2
          const opacity = isHighlighted ? 1 : 0.85

          // Left side: horizontal stub OUT of the card (left column),
          //            vertical joiner,
          //            horizontal stub INTO the next column (right side of gutter)
          // Right side: mirror horizontally.
          //
          // x=0   → edge of previous (card) column
          // x=50  → vertical pair joiner
          // x=100 → edge of next (card) column
          //
          // We draw a single polyline so the stroke joins cleanly
          // at the corners.
          const points =
            side === 'left'
              ? [
                  `0,${topY}`,
                  `50,${topY}`,
                  `50,${botY}`,
                  `0,${botY}`,
                ]
              : [
                  `100,${topY}`,
                  `50,${topY}`,
                  `50,${botY}`,
                  `100,${botY}`,
                ]
          const midOut =
            side === 'left'
              ? `50,${midY} 100,${midY}`
              : `50,${midY} 0,${midY}`
          return (
            <g key={pairIdx}>
              <polyline
                points={points.join(' ')}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                opacity={opacity}
              />
              <polyline
                points={midOut}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                opacity={opacity}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ─── Centre column (Final + Bronze only) ──────────────────────
//
// SFs stay in their BracketHalf columns connected to the QF
// bracket lines. The centre column holds only the Final and
// Bronze cards vertically centred. No trophy for now.
//
// Champion caption renders as a small badge between the two cards.

interface CentreColumnProps {
  final: KnockoutSlot | null
  bronze: KnockoutSlot | null
  champion: SimTeam | null
  copy: BracketCopy
  header?: React.ReactNode
  cardProps: {
    onPick: (matchNumber: number, winnerCode: string) => void
    moroccoPath: Set<number>
    montecarlo: MonteCarloResults | null
    pensLabel: string
  }
}

function CentreColumn({
  final,
  bronze,
  champion,
  copy,
  header,
  cardProps,
}: CentreColumnProps) {
  return (
    <div
      style={{
        flex: '0 0 300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 12,
        padding: '0 10px',
      }}
    >
      {/* Title + toolbar — centred above the trophy */}
      {header}

      {/* Trophy — no card wrapper, just the image */}
      <img
        src="/brand/world-cup-trophy.png"
        alt="FIFA World Cup Trophy"
        width={100}
        height={150}
        loading="eager"
        style={{
          width: 100,
          height: 'auto',
          maxHeight: 150,
          objectFit: 'contain',
          filter: champion
            ? 'drop-shadow(0 4px 16px rgba(196, 143, 31, 0.35))'
            : 'grayscale(0.85) opacity(0.4)',
          transition: 'filter 300ms ease',
        }}
      />

      {/* Champion presentation — no card, just label + badge */}
      {champion ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#c48f1f',
            }}
          >
            {copy.championTitle}
          </span>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 20px',
              maxWidth: 200,
              background: 'linear-gradient(135deg, rgba(246, 217, 140, 0.35) 0%, rgba(230, 180, 80, 0.18) 100%)',
              border: '2px solid var(--gold, #e6b450)',
              borderRadius: 'var(--radius)',
              boxShadow: '0 2px 10px rgba(230, 180, 80, 0.25)',
            }}
          >
            <img
              src={countryFlagUrl(champion.code, 80)}
              alt={teamNameFromCode(champion.code)}
              width={36}
              height={24}
              style={{ objectFit: 'cover', borderRadius: 4, boxShadow: '0 0 0 1px rgba(0,0,0,0.15)' }}
            />
            <span
              style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 900, color: 'var(--text)', lineHeight: 1 }}
            >
              {teamNameFromCode(champion.code)}
            </span>
          </div>
        </div>
      ) : (
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-faint)', textAlign: 'center', lineHeight: 1.5 }}>
          {copy.awaiting}
        </div>
      )}

      {/* Final card */}
      {final && (
        <div style={{ width: '100%', maxWidth: 260 }}>
          <SectionLabel label={copy.final} accent="gold" />
          <BracketCard
            slot={final}
            moroccoPath={cardProps.moroccoPath}
            montecarlo={cardProps.montecarlo}
            onPick={cardProps.onPick}
            pensLabel={cardProps.pensLabel}
            variant="final"
          />
        </div>
      )}

      {/* Bronze card */}
      {bronze && (
        <div style={{ width: '100%', maxWidth: 260 }}>
          <SectionLabel label={copy.bronze} accent="bronze" />
          <BracketCard
            slot={bronze}
            moroccoPath={cardProps.moroccoPath}
            montecarlo={cardProps.montecarlo}
            onPick={cardProps.onPick}
            pensLabel={cardProps.pensLabel}
            variant="bronze"
          />
        </div>
      )}
    </div>
  )
}


function SectionLabel({ label, accent }: { label: string; accent: 'gold' | 'bronze' }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-head)',
        fontSize: 9,
        fontWeight: 800,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: accent === 'gold' ? '#c48f1f' : '#cd7f32',
        textAlign: 'center',
        marginBottom: 6,
      }}
    >
      {label}
    </div>
  )
}

// ─── Mobile trophy hero ────────────────────────────────────────

function MobileTrophy({
  champion,
  thirdPlace,
  copy,
}: {
  champion: SimTeam | null
  thirdPlace: SimTeam | null
  copy: BracketCopy
}) {
  return (
    <div
      style={{
        background: champion
          ? 'linear-gradient(135deg, rgba(230, 180, 80, 0.22) 0%, rgba(10, 82, 41, 0.18) 100%)'
          : 'var(--card)',
        border: champion ? '2px solid var(--gold, #e6b450)' : '1px dashed var(--border)',
        borderRadius: 'var(--radius)',
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        flexWrap: 'wrap',
      }}
    >
      {/* Mobile trophy */}
      <img
        src="/brand/world-cup-trophy.png"
        alt=""
        width={48}
        height={72}
        style={{
          width: 48,
          height: 'auto',
          objectFit: 'contain',
          flexShrink: 0,
          filter: champion
            ? 'drop-shadow(0 2px 8px rgba(196, 143, 31, 0.35))'
            : 'grayscale(0.85) opacity(0.4)',
        }}
      />
      <div style={{ flex: 1, minWidth: 160 }}>
        <div
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-faint)',
          }}
        >
          {copy.championTitle}
        </div>
        {champion ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <img
              src={countryFlagUrl(champion.code, 80)}
              alt=""
              width={36}
              height={24}
              style={{ objectFit: 'cover', borderRadius: 3, boxShadow: '0 0 0 1px rgba(0,0,0,0.18)' }}
            />
            <div
              style={{
                fontFamily: 'var(--font-head)',
                fontSize: 20,
                fontWeight: 900,
                fontStyle: 'italic',
                color: 'var(--text)',
              }}
            >
              {teamNameFromCode(champion.code)}
            </div>
          </div>
        ) : (
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-faint)', marginTop: 4 }}>
            {copy.awaiting}
          </div>
        )}
      </div>
      {thirdPlace && (
        <div
          style={{
            padding: '6px 10px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#cd7f32',
            }}
          >
            🥉
          </span>
          <img
            src={countryFlagUrl(thirdPlace.code, 40)}
            alt=""
            width={20}
            height={14}
            style={{ objectFit: 'cover', borderRadius: 2, boxShadow: '0 0 0 1px rgba(0,0,0,0.12)' }}
          />
          <span
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--text)',
            }}
          >
            {teamNameFromCode(thirdPlace.code)}
          </span>
        </div>
      )}
    </div>
  )
}

// ─── Compact bracket card (click-to-advance) ───────────────────

interface BracketCardProps {
  slot: KnockoutSlot
  moroccoPath: Set<number>
  montecarlo: MonteCarloResults | null
  onPick: (matchNumber: number, winnerCode: string) => void
  pensLabel: string
  variant?: 'default' | 'final' | 'bronze'
  mobile?: boolean
}

function BracketCard({ slot, moroccoPath, montecarlo, onPick, pensLabel, variant, mobile }: BracketCardProps) {
  const highlighted = moroccoPath.has(slot.matchNumber)
  const hasWinner = !!slot.winner
  const isHomeWinner = hasWinner && slot.winner?.code === slot.homeTeam?.code
  const isAwayWinner = hasWinner && slot.winner?.code === slot.awayTeam?.code
  const canInteract = !!slot.homeTeam && !!slot.awayTeam && !hasWinner

  const homeScore = slot.homeScore ?? null
  const awayScore = slot.awayScore ?? null
  // A draw on the scoreline with a declared winner → shootout.
  const wentToPens =
    hasWinner && homeScore !== null && awayScore !== null && homeScore === awayScore

  const cardBorder = highlighted
    ? 'var(--gold, #e6b450)'
    : hasWinner
      ? 'var(--green, #0a5229)'
      : 'var(--border)'

  const cardShadow = highlighted
    ? '0 0 0 2px rgba(230, 180, 80, 0.25)'
    : variant === 'final'
      ? 'none'
      : undefined

  return (
    <div
      data-match={slot.matchNumber}
      style={{
        background: 'var(--card)',
        // Final card draws its border from the wrapper div in
        // CentreColumn so we only draw an inner hairline here.
        // Final card now renders at the same size as Bronze —
        // the gold wrapper that previously added 4px border is
        // gone. Use a gold left-border accent instead for visual
        // differentiation without changing the card's dimensions.
        border: variant === 'final'
          ? `1px solid var(--gold, #e6b450)`
          : `1px solid ${cardBorder}`,
        borderInlineStart: variant === 'final'
          ? '4px solid var(--gold, #e6b450)'
          : undefined,
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
        boxShadow: cardShadow,
        width: '100%',
        // Tier 2 tightening: 120 px min keeps a full bracket
        // visible on a ~1280 px viewport without horizontal
        // scroll. Cap at 160 px so wide columns don't over-stretch.
        // Centre-column cards (final/bronze) are wider to fill the
        // 300 px centre gutter — no 160 px cap for those.
        minWidth: mobile ? 'auto' : (variant === 'final' || variant === 'bronze') ? 200 : 120,
        maxWidth: mobile ? undefined : (variant === 'final' || variant === 'bronze') ? 260 : 160,
        transition: 'border-color 200ms ease, box-shadow 200ms ease',
      }}
    >
      {/* Match header — two lines, stacked. Mirrors the reference
          image's "Match 74 / Boston" format. Makes every card
          read like a mini scoreboard rather than a compact chip. */}
      <div
        style={{
          padding: '5px 8px 4px',
          background: 'var(--card-alt)',
          borderBottom: '1px solid var(--border)',
          textAlign: 'center',
          lineHeight: 1.15,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            fontWeight: 700,
            color: 'var(--text-faint)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          Match {slot.matchNumber}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--text-faint)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginTop: 1,
          }}
        >
          {slot.city}
        </div>
      </div>

      {/* Home row */}
      <TeamStrip
        team={slot.homeTeam}
        label={slot.homeLabel}
        score={homeScore}
        isWinner={!!isHomeWinner}
        canInteract={canInteract}
        pens={wentToPens && isHomeWinner ? '(P)' : ''}
        probability={
          montecarlo && slot.homeTeam
            ? montecarlo.winProbability[slot.homeTeam.code]
            : undefined
        }
        onClick={() => {
          if (canInteract && slot.homeTeam) onPick(slot.matchNumber, slot.homeTeam.code)
        }}
      />
      <div style={{ height: 1, background: 'var(--border)' }} />
      {/* Away row */}
      <TeamStrip
        team={slot.awayTeam}
        label={slot.awayLabel}
        score={awayScore}
        isWinner={!!isAwayWinner}
        canInteract={canInteract}
        pens={wentToPens && isAwayWinner ? '(P)' : ''}
        probability={
          montecarlo && slot.awayTeam
            ? montecarlo.winProbability[slot.awayTeam.code]
            : undefined
        }
        onClick={() => {
          if (canInteract && slot.awayTeam) onPick(slot.matchNumber, slot.awayTeam.code)
        }}
      />

      {/* Penalty shootout strip */}
      {wentToPens && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '34px 1fr 1fr',
            background: 'var(--card-alt)',
            borderTop: '1px solid var(--border)',
            alignItems: 'center',
            minHeight: 20,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 8,
              fontWeight: 700,
              color: 'var(--text-faint)',
              letterSpacing: '0.08em',
              textAlign: 'center',
            }}
          >
            {pensLabel}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              fontWeight: 700,
              color: isHomeWinner ? '#fff' : 'var(--text-faint)',
              background: isHomeWinner ? 'var(--green, #0a5229)' : 'transparent',
              textAlign: 'center',
              padding: '2px 0',
            }}
          >
            {slot.homeTeam?.code ?? ''}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              fontWeight: 700,
              color: isAwayWinner ? '#fff' : 'var(--text-faint)',
              background: isAwayWinner ? 'var(--green, #0a5229)' : 'transparent',
              textAlign: 'center',
              padding: '2px 0',
            }}
          >
            {slot.awayTeam?.code ?? ''}
          </span>
        </div>
      )}
    </div>
  )
}

// ─── Team strip (row) ──────────────────────────────────────────

interface TeamStripProps {
  team: SimTeam | null | undefined
  label: string
  score: number | null
  isWinner: boolean
  canInteract: boolean
  pens: string
  probability?: number
  onClick: () => void
}

function TeamStrip({ team, label, score, isWinner, canInteract, pens, probability, onClick }: TeamStripProps) {
  const isMorocco = team?.code === 'MAR'
  const code = team?.code ?? null

  const bg = isWinner
    ? 'rgba(10, 82, 41, 0.14)'
    : isMorocco
      ? 'rgba(10, 82, 41, 0.04)'
      : 'transparent'

  return (
    <button
      type="button"
      disabled={!canInteract || !team}
      onClick={onClick}
      style={{
        display: 'grid',
        gridTemplateColumns: '22px 1fr auto',
        alignItems: 'center',
        gap: 6,
        padding: '6px 8px',
        background: bg,
        borderInlineStart: isWinner ? '3px solid var(--green, #0a5229)' : '3px solid transparent',
        border: 'none',
        borderTop: 'none',
        borderRight: 'none',
        borderBottom: 'none',
        width: '100%',
        minHeight: 26,
        cursor: canInteract && team ? 'pointer' : 'default',
        textAlign: 'start',
        fontFamily: 'var(--font-body)',
      }}
      aria-label={team ? `Pick ${teamNameFromCode(team.code)} as winner` : undefined}
    >
      {code ? (
        <img
          src={countryFlagUrl(code, 40)}
          alt=""
          width={22}
          height={14}
          loading="lazy"
          style={{
            objectFit: 'cover',
            borderRadius: 2,
            boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
          }}
        />
      ) : (
        <span
          style={{
            display: 'inline-block',
            width: 22,
            height: 14,
            background: 'var(--card-alt)',
            border: '1px dashed var(--border)',
            borderRadius: 2,
          }}
        />
      )}

      <span
        style={{
          fontFamily: 'var(--font-head)',
          fontSize: 11,
          fontWeight: isWinner ? 800 : 600,
          color: code ? 'var(--text)' : 'var(--text-faint)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          letterSpacing: '0.02em',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {code ?? label}
        {pens && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 8,
              color: 'var(--green, #0a5229)',
              fontWeight: 700,
            }}
          >
            {pens}
          </span>
        )}
        {probability !== undefined && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 8,
              color: 'var(--text-faint)',
              marginInlineStart: 'auto',
            }}
          >
            {probability.toFixed(0)}%
          </span>
        )}
      </span>

      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          fontWeight: 800,
          color: isWinner ? 'var(--text)' : 'var(--text-faint)',
          minWidth: 16,
          textAlign: 'end',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {score ?? ''}
      </span>
    </button>
  )
}
