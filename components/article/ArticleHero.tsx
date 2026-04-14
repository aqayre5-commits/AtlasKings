import { categoryLabel, categoryColor } from '@/lib/utils'

interface ArticleHeroProps {
  title: string
  category: string
  /**
   * Pre-resolved image URL. Pass through `resolveArticleThumbnail()` from
   * the page so the fallback chain (player → team → venue → competition →
   * category) runs at render time. When undefined, the hero falls back to
   * a brand-tinted gradient.
   */
  image?: string | null
  imageAlt?: string
}

export function ArticleHero({ title, category, image, imageAlt }: ArticleHeroProps) {
  const color = categoryColor(category)
  const label = categoryLabel(category)

  return (
    <div style={{ marginBottom: 0 }}>
      {/* Hero image */}
      <div
        style={{
          width: '100%',
          aspectRatio: '16/9',
          overflow: 'hidden',
          background: '#0a0a0a',
          borderRadius: 'var(--radius) var(--radius) 0 0',
          position: 'relative',
        }}
      >
        {image ? (
          <img
            src={image}
            alt={imageAlt ?? title}
            loading="eager"
            decoding="async"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(140deg, ${color}22 0%, #050505 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: '0.22em',
                color: 'rgba(255,255,255,0.08)',
                textTransform: 'uppercase',
              }}
            >
              Atlas Kings
            </span>
          </div>
        )}
      </div>

      {/* Category kicker */}
      <div style={{ padding: '20px 0 12px' }}>
        <span
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-head)',
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color,
            background: `${color}15`,
            padding: '3px 10px',
            borderRadius: 'var(--radius-sm)',
            lineHeight: 1.5,
          }}
        >
          {label}
        </span>
      </div>
    </div>
  )
}
