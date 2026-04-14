/**
 * <TrustBadge> — editorial trust signal primitive.
 * ─────────────────────────────────────────────────────────────────────
 *
 * Three-state chip that labels the editorial review status of a piece of
 * content. Part of the Atlas Kings trust system:
 *
 *   - editor-reviewed  → green solid ✓ — human wrote/reviewed end-to-end
 *   - ai-assisted      → gold outlined ◐ — Claude draft + human review pass
 *   - automated        → grey outlined ○ — Claude draft, no review (default)
 *
 * Used on:
 *   - `/morocco` flagship page, single instance on the "This Week in Morocco" block
 *   - Future: `/articles/[slug]` article headers (wired in §2 article pass, not now)
 *
 * Pure server-safe presentational component. No client-side behaviour,
 * no hooks, zero JS shipped. Rendered as a single <span> with ARIA
 * status role so screen readers announce the trust level.
 *
 * Byline policy (Decision C1): organization-level attribution only.
 * The badge labels the REVIEW STATE, not the reviewer identity.
 */

import type { Lang } from '@/lib/i18n/config'

export type TrustBadgeState = 'editor-reviewed' | 'ai-assisted' | 'automated'

export interface TrustBadgeProps {
  /** Review state of the labeled content. */
  state: TrustBadgeState
  /** Visual size — small for inline use, medium for headers. Default: medium. */
  size?: 'small' | 'medium'
  /** Language for the label text. Default: 'en'. */
  lang?: Lang
  /**
   * Override the default tooltip. Useful if the content's provenance needs
   * more context than the canonical explanation.
   */
  tooltip?: string
}

// ── Localised labels + tooltips ─────────────────────────────────────────

interface StateCopy {
  label: string
  tooltip: string
}

const COPY: Record<Lang, Record<TrustBadgeState, StateCopy>> = {
  en: {
    'editor-reviewed': {
      label: 'Editor Reviewed',
      tooltip: 'A member of the Atlas Kings editorial team wrote or reviewed this story end-to-end.',
    },
    'ai-assisted': {
      label: 'AI-assisted · Editor checked',
      tooltip: 'This story was drafted with AI assistance and then reviewed by an editor.',
    },
    'automated': {
      label: 'Automated draft',
      tooltip: 'This story was generated from a verified source by our AI-assisted pipeline. Not yet editor-reviewed.',
    },
  },
  ar: {
    'editor-reviewed': {
      label: 'تمت المراجعة من قبل المحرر',
      tooltip: 'قام أحد أعضاء فريق أطلس كينغز التحريري بكتابة أو مراجعة هذه القصة من البداية إلى النهاية.',
    },
    'ai-assisted': {
      label: 'بمساعدة الذكاء الاصطناعي · تم التحقق',
      tooltip: 'تمت صياغة هذه القصة بمساعدة الذكاء الاصطناعي ثم تمت مراجعتها من قبل محرر.',
    },
    'automated': {
      label: 'مسودة آلية',
      tooltip: 'تم إنشاء هذه القصة من مصدر موثوق عبر خط أنابيبنا المدعوم بالذكاء الاصطناعي. لم تتم مراجعتها من قبل محرر بعد.',
    },
  },
  fr: {
    'editor-reviewed': {
      label: 'Vérifié par l\'éditeur',
      tooltip: 'Un membre de l\'équipe éditoriale d\'Atlas Kings a rédigé ou révisé cet article de bout en bout.',
    },
    'ai-assisted': {
      label: 'Assisté par IA · Vérifié',
      tooltip: 'Cet article a été rédigé avec l\'aide de l\'IA puis relu par un éditeur.',
    },
    'automated': {
      label: 'Brouillon automatisé',
      tooltip: 'Cet article a été généré à partir d\'une source vérifiée par notre pipeline assisté par IA. Pas encore relu par un éditeur.',
    },
  },
}

// ── Visual tokens per state ─────────────────────────────────────────────

interface StateStyle {
  icon: string
  color: string
  background: string
  border: string
}

const STATE_STYLES: Record<TrustBadgeState, StateStyle> = {
  'editor-reviewed': {
    icon: '✓',
    color: '#ffffff',
    background: 'var(--green)',
    border: '1px solid var(--green)',
  },
  'ai-assisted': {
    icon: '◐',
    color: 'var(--gold)',
    background: 'transparent',
    border: '1px solid var(--gold)',
  },
  'automated': {
    icon: '○',
    color: 'var(--text-faint)',
    background: 'transparent',
    border: '1px solid var(--border-mid)',
  },
}

const SIZE_STYLES = {
  small: { fontSize: 9, padding: '3px 8px', iconSize: 10, gap: 4 },
  medium: { fontSize: 10, padding: '5px 10px', iconSize: 11, gap: 5 },
} as const

// ── Component ───────────────────────────────────────────────────────────

export function TrustBadge({
  state,
  size = 'medium',
  lang = 'en',
  tooltip,
}: TrustBadgeProps) {
  const copy = COPY[lang]?.[state] ?? COPY.en[state]
  const style = STATE_STYLES[state]
  const sz = SIZE_STYLES[size]
  const label = copy.label
  const title = tooltip ?? copy.tooltip

  return (
    <span
      data-trust-badge={state}
      role="status"
      aria-label={`${label}. ${title}`}
      title={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: sz.gap,
        fontFamily: 'var(--font-mono)',
        fontSize: sz.fontSize,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: style.color,
        background: style.background,
        border: style.border,
        borderRadius: 'var(--radius-sm)',
        padding: sz.padding,
        whiteSpace: 'nowrap',
        lineHeight: 1,
        verticalAlign: 'middle',
        minHeight: 22,
      }}
    >
      <span
        aria-hidden
        style={{
          fontSize: sz.iconSize,
          lineHeight: 1,
        }}
      >
        {style.icon}
      </span>
      <span>{label}</span>
    </span>
  )
}
