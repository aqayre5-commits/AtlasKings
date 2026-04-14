'use client'

import Image from 'next/image'
import type { BestThirdEntry } from '@/lib/simulator/bestThird'
import { getTranslations } from '@/lib/i18n/translations'
import type { Lang } from '@/lib/i18n/config'

interface Props {
  bestThird: BestThirdEntry[]
  lang?: string
}

export function BestThirdPanel({ bestThird, lang = 'en' }: Props) {
  const t = getTranslations((lang === 'ar' || lang === 'fr' ? lang : 'en') as Lang).simulator.bestThird

  if (bestThird.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: 40,
          color: 'var(--text-faint)',
          fontFamily: 'var(--font-head)',
          fontSize: 16,
        }}
      >
        {t.emptyState}
      </div>
    )
  }

  const headers = [
    { key: 'pos', label: t.headers.pos, width: 28, align: 'center' as const },
    { key: 'team', label: t.headers.team, align: 'left' as const },
    { key: 'group', label: t.headers.group, width: 44, align: 'center' as const },
    { key: 'pts', label: t.headers.pts, width: 44, align: 'center' as const },
    { key: 'gd', label: t.headers.gd, width: 44, align: 'center' as const },
    { key: 'gf', label: t.headers.gf, width: 44, align: 'center' as const },
    { key: 'status', label: t.headers.status, width: 90, align: 'center' as const },
  ]

  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--card-alt)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            width: 4,
            height: 16,
            borderRadius: 2,
            background: 'var(--gold)',
            flexShrink: 0,
          }}
        />
        <h3
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--text)',
            margin: 0,
          }}
        >
          {t.title}
        </h3>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-faint)',
            marginLeft: 'auto',
          }}
        >
          {t.topAdvance}
        </span>
      </div>

      <table
        className="data-table"
        style={{ width: '100%', borderCollapse: 'collapse' }}
        aria-label={t.title}
      >
        <thead>
          <tr>
            {headers.map((col) => (
              <th
                key={col.key}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  fontWeight: 600,
                  color: 'var(--text-faint)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '8px 8px',
                  textAlign: col.align,
                  borderBottom: '1px solid var(--border)',
                  ...(col.width ? { width: col.width } : {}),
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bestThird.map((entry, idx) => (
            <tr
              key={entry.team.code}
              style={{
                borderBottom: '1px solid var(--border)',
                borderLeft: entry.advances
                  ? '3px solid var(--green)'
                  : '3px solid transparent',
                opacity: entry.advances ? 1 : 0.5,
                transition: 'all 0.2s ease',
              }}
            >
              <td
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--text-faint)',
                  textAlign: 'center',
                  padding: '8px',
                }}
              >
                {idx + 1}
              </td>

              <td style={{ padding: '8px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Image
                    src={entry.team.flagUrl}
                    alt={`${entry.team.name} flag`}
                    width={20}
                    height={15}
                    style={{
                      objectFit: 'contain',
                      borderRadius: 2,
                      flexShrink: 0,
                    }}
                    unoptimized
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-head)',
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'var(--text)',
                    }}
                  >
                    {entry.team.name}
                  </span>
                </div>
              </td>

              <td
                style={{
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--text-sec)',
                  padding: '8px',
                }}
              >
                {entry.group}
              </td>

              <td
                style={{
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--text)',
                  padding: '8px',
                }}
              >
                {entry.points}
              </td>

              <td
                style={{
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--text-sec)',
                  padding: '8px',
                }}
              >
                {entry.gd > 0 ? `+${entry.gd}` : entry.gd}
              </td>

              <td
                style={{
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--text-sec)',
                  padding: '8px',
                }}
              >
                {entry.gf}
              </td>

              <td style={{ textAlign: 'center', padding: '8px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: entry.advances
                      ? 'var(--green-light)'
                      : 'var(--red-light)',
                    color: entry.advances ? 'var(--green)' : 'var(--red)',
                  }}
                >
                  {entry.advances ? t.advances : t.eliminated}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
