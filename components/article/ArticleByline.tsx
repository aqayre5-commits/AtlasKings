/**
 * <ArticleByline> — author, dates, trust badge, and share row.
 * ─────────────────────────────────────────────────────────────────────
 *
 * Replaces the old <ArticleMeta> for /articles/[slug]. Adds the editorial
 * trust signal next to the byline and surfaces a "Last updated" line when
 * the article has been modified after publication.
 *
 * Decision C1: byline is always organization-level
 * ("Atlas Kings Editorial Team"). No individual editor names. The trust
 * badge labels the REVIEW STATE, not the reviewer identity.
 *
 * The component re-uses the existing share-button SVGs from the legacy
 * ArticleMeta but is otherwise self-contained. The legacy ArticleMeta is
 * NOT deleted in this PR — it stays as a no-op fallback in case any other
 * surface still imports it. The /articles/[slug] page is the only known
 * consumer and it switches to ArticleByline here.
 */

'use client'

import { TrustBadge, type TrustBadgeState } from '@/components/primitives/TrustBadge'
import { formatDate } from '@/lib/utils'
import type { Lang } from '@/lib/i18n/config'

interface ArticleBylineProps {
  author: string
  date: string
  /** ISO timestamp of the most recent edit. If equal to `date`, hidden. */
  modified?: string
  readingTime?: number
  /** Editorial trust state. Defaults to 'automated'. */
  trustState?: TrustBadgeState
  /** Optional original-source URL for provenance link. */
  sourceUrl?: string
  /** Source publication name for the provenance label. */
  sourceName?: string
  /** Display language — used by the trust badge for label translation. */
  lang?: Lang
}

const UPDATED_LABEL: Record<Lang, string> = {
  en: 'Updated',
  ar: 'آخر تحديث',
  fr: 'Mis à jour',
}

const READ_LABEL: Record<Lang, string> = {
  en: 'min read',
  ar: 'دقائق قراءة',
  fr: 'min de lecture',
}

const SHARE_LABEL: Record<Lang, string> = {
  en: 'Share',
  ar: 'مشاركة',
  fr: 'Partager',
}

export function ArticleByline({
  author,
  date,
  modified,
  readingTime,
  trustState = 'automated',
  sourceUrl,
  sourceName,
  lang = 'en',
}: ArticleBylineProps) {
  const isModified = modified && modified !== date
  const updatedLabel = UPDATED_LABEL[lang]
  const readLabel = READ_LABEL[lang]
  const shareLabel = SHARE_LABEL[lang]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: '14px 0',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        marginBottom: 28,
      }}
    >
      {/* Top row: byline + share */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {/* Byline cluster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Author avatar — organization mark */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'var(--green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '1px solid var(--border)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-head)',
                fontSize: 14,
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1,
              }}
            >
              AK
            </span>
          </div>

          {/* Author + date stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              <span>{author}</span>
              <TrustBadge state={trustState} size="small" lang={lang} />
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-faint)',
                letterSpacing: '0.03em',
                marginTop: 1,
              }}
            >
              {formatDate(date)}
              {readingTime ? ` · ${readingTime} ${readLabel}` : ''}
              {isModified ? ` · ${updatedLabel} ${formatDate(modified!)}` : ''}
            </div>
          </div>
        </div>

        {/* Share buttons */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-faint)',
            }}
          >
            {shareLabel}
          </span>
          {[
            {
              label: 'X',
              icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" width={13} height={13}>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.393 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              ),
            },
            {
              label: 'WhatsApp',
              icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" width={13} height={13}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              ),
            },
            {
              label: 'Facebook',
              icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" width={13} height={13}>
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              ),
            },
          ].map(btn => (
            <button
              key={btn.label}
              type="button"
              aria-label={`${shareLabel} · ${btn.label}`}
              onClick={() => {
                /* Wired up by a future share-handler PR; placeholder for now. */
              }}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: '1px solid var(--border)',
                background: 'var(--card-alt)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-sec)',
                transition: 'background 0.12s, color 0.12s',
              }}
            >
              {btn.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Optional source provenance line — appears when sourceUrl is set */}
      {sourceUrl && sourceName && (
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-faint)',
            letterSpacing: '0.04em',
          }}
        >
          {lang === 'ar' ? 'المصدر' : lang === 'fr' ? 'Source' : 'Source'}:{' '}
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--text-sec)',
              textDecoration: 'underline',
              textUnderlineOffset: 2,
            }}
          >
            {sourceName}
          </a>
        </div>
      )}
    </div>
  )
}
