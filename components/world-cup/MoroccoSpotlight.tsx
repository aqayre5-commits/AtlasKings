import Link from 'next/link'
import Image from 'next/image'

interface Props {
  langPrefix: string
  lang?: string
}

const translations: Record<string, Record<string, string>> = {
  en: { hostNation: 'Host Nation', group: 'Group', coach: 'Coach', fifaRank: 'FIFA Rank', cta: 'View full Morocco hub' },
  ar: { hostNation: 'الدولة المضيفة', group: 'المجموعة', coach: 'المدرب', fifaRank: 'تصنيف الفيفا', cta: 'زيارة صفحة المغرب' },
  fr: { hostNation: 'Pays hôte', group: 'Groupe', coach: 'Sélectionneur', fifaRank: 'Classement FIFA', cta: 'Voir le hub Maroc' },
  es: { hostNation: 'País anfitrión', group: 'Grupo', coach: 'Entrenador', fifaRank: 'Ranking FIFA', cta: 'Ver hub de Marruecos' },
}

function t(lang: string | undefined, key: string): string {
  const l = lang && translations[lang] ? lang : 'en'
  return translations[l][key] || translations.en[key]
}

export function MoroccoSpotlight({ langPrefix, lang }: Props) {
  return (
    <section aria-label={t(lang, 'hostNation')}>
      <Link
        href={`${langPrefix}/world-cup/teams/morocco`}
        style={{
          display: 'block',
          textDecoration: 'none',
          background: 'var(--card)',
          border: '1px solid var(--green)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 20px',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 'var(--tap-min)',
        }}
      >
        {/* Subtle pattern overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 120,
          height: 120,
          opacity: 0.06,
          background: 'radial-gradient(circle, var(--green-bright) 0%, transparent 70%)',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Flag */}
          <Image
            src="https://flagcdn.com/w80/ma.png"
            alt="Morocco flag"
            width={56}
            height={40}
            style={{ objectFit: 'contain', borderRadius: 4, flexShrink: 0, border: '1px solid var(--border)' }}
            unoptimized
          />

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Kicker */}
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--green-bright)',
              display: 'block',
              marginBottom: 4,
            }}>
              {t(lang, 'hostNation')}
            </span>

            {/* Heading */}
            <h3 style={{
              fontFamily: 'var(--font-head)',
              fontSize: 20,
              fontWeight: 800,
              fontStyle: 'italic',
              color: 'var(--text)',
              margin: 0,
              lineHeight: 1.2,
            }}>
              Morocco at WC 2026
            </h3>
          </div>
        </div>

        {/* Quick info */}
        <div style={{
          display: 'flex',
          gap: 16,
          marginTop: 16,
          paddingTop: 12,
          borderTop: '1px solid var(--border)',
        }}>
          <div>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-sec)',
              display: 'block',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 2,
            }}>
              {t(lang, 'group')}
            </span>
            <span style={{
              fontFamily: 'var(--font-head)',
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--text)',
            }}>
              Group C
            </span>
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-sec)',
              display: 'block',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 2,
            }}>
              {t(lang, 'coach')}
            </span>
            <span style={{
              fontFamily: 'var(--font-head)',
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--text)',
            }}>
              Mohamed Ouahbi
            </span>
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-sec)',
              display: 'block',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 2,
            }}>
              {t(lang, 'fifaRank')}
            </span>
            <span style={{
              fontFamily: 'var(--font-head)',
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--text)',
            }}>
              13th
            </span>
          </div>
        </div>

        {/* CTA hint */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          fontWeight: 700,
          color: 'var(--green-bright)',
          marginTop: 14,
          letterSpacing: '0.06em',
        }}>
          {t(lang, 'cta')} &rarr;
        </div>
      </Link>
    </section>
  )
}
