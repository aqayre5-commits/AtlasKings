/**
 * <MoroccoSectionHeader> — patriotic strip header primitive for Morocco
 * surfaces.
 * ─────────────────────────────────────────────────────────────────────
 *
 * Used on `/morocco` and downstream Morocco pages to label content
 * strips with a consistent Atlas Lions identity.
 *
 * Visual:
 *    ATLAS LIONS
 *   🇲🇦 RECENT RESULTS                              All fixtures →
 *    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * The small "ATLAS LIONS" kicker anchors the Morocco identity, the flag
 * emoji reinforces it at a glance, and the thin red/green/red accent
 * stripe below echoes the flag pattern. Tone: patriotic and premium —
 * never federation-official.
 *
 * Do NOT use this primitive on non-Morocco surfaces. Generic league
 * pages should continue to use their existing (plainer) section headers.
 */

import Link from 'next/link'
import type { ReactNode } from 'react'

export interface MoroccoSectionHeaderProps {
  /** Main label rendered in bold head-font (e.g. "Recent Results"). */
  title: string
  /** Small kicker above the title. Defaults to "Atlas Lions". */
  kicker?: string
  /** Optional "View all" link destination. */
  href?: string
  /** Label for the "View all" link (e.g. "All fixtures →"). */
  hrefLabel?: string
  /** Show the Moroccan flag emoji prefix before the title. Default: true. */
  showFlag?: boolean
  /** Render the red/green/red accent stripe under the header. Default: true. */
  showAccent?: boolean
  /** Optional slot rendered on the right instead of (or alongside) the link. */
  rightSlot?: ReactNode
  /** Optional heading level. Defaults to h2. */
  as?: 'h2' | 'h3'
}

export function MoroccoSectionHeader({
  title,
  kicker = 'Atlas Lions',
  href,
  hrefLabel,
  showFlag = true,
  showAccent = true,
  rightSlot,
  as = 'h2',
}: MoroccoSectionHeaderProps) {
  const Heading = as

  return (
    <div data-morocco-section-header style={{ marginBottom: 12 }}>
      {/* Kicker */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--green-bright)',
          marginBottom: 4,
        }}
      >
        {kicker}
      </div>

      {/* Title row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          minHeight: 32,
        }}
      >
        <Heading
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 'var(--h3)',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--text)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flex: 1,
            minWidth: 0,
          }}
        >
          {showFlag && (
            <span aria-hidden style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>
              🇲🇦
            </span>
          )}
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </span>
        </Heading>

        {/* Right slot wins over href when both are passed */}
        {rightSlot ? (
          <div style={{ flexShrink: 0 }}>{rightSlot}</div>
        ) : href && hrefLabel ? (
          <Link
            href={href}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--red)',
              textDecoration: 'none',
              padding: '6px 0',
              minHeight: 'var(--tap-min)',
              display: 'inline-flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            {hrefLabel}
          </Link>
        ) : null}
      </div>

      {/* Red-green-red accent stripe echoing the Moroccan flag */}
      {showAccent && (
        <div
          aria-hidden
          style={{
            marginTop: 8,
            height: 2,
            borderRadius: 1,
            background:
              'linear-gradient(90deg, #c1121f 0%, #c1121f 33%, #0a5229 33%, #0a5229 66%, #c1121f 66%)',
          }}
        />
      )}
    </div>
  )
}
