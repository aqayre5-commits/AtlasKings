import Link from 'next/link'
import Image from 'next/image'
import { TeamLogo } from '@/components/ui/TeamLogo'
import type { FixtureLite, NewsCardData } from '@/types/world-cup'

interface Props {
  featuredMatch?: FixtureLite | null
  featuredStory?: NewsCardData | null
  langPrefix: string
}

function FeaturedMatchCard({ match, langPrefix }: { match: FixtureLite; langPrefix: string }) {
  const isLive = match.status === 'LIVE' || match.status === 'HT'
  const isDone = match.status === 'FT' || match.status === 'AET' || match.status === 'PEN'

  return (
    <Link
      href={`${langPrefix}/world-cup/matches/${match.id}`}
      style={{
        display: 'block',
        textDecoration: 'none',
        background: isLive
          ? 'var(--card-alt)'
          : 'var(--card)',
        border: isLive ? '1px solid var(--green)' : '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Kicker */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: isLive ? 'var(--green-bright)' : 'var(--green)',
        textAlign: 'center',
        marginBottom: 20,
      }}>
        {isLive && (
          <span style={{ marginRight: 6 }}>
            <span style={{
              display: 'inline-block',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--live)',
              marginRight: 4,
              animation: 'pulse 1.4s ease-in-out infinite',
              verticalAlign: 'middle',
            }} />
            LIVE
          </span>
        )}
        {match.roundLabel}{match.group ? ` \u00B7 ${match.group}` : ''}
      </div>

      {/* Teams + Score */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
      }}>
        {/* Home */}
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <TeamLogo src={match.homeTeam.flagUrl} alt={match.homeTeam.name} size={48} />
          </div>
          <div style={{
            fontFamily: 'var(--font-head)',
            fontSize: 15,
            fontWeight: 700,
            color: 'var(--text)',
          }}>
            {match.homeTeam.name}
          </div>
        </div>

        {/* Score / Time */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          {isDone || isLive ? (
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 36,
              fontWeight: 700,
              color: isLive ? 'var(--green-bright)' : 'var(--text)',
              lineHeight: 1,
            }}>
              {match.homeScore ?? 0} &ndash; {match.awayScore ?? 0}
            </div>
          ) : (
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--green)',
              lineHeight: 1,
            }}>
              {new Date(match.dateUtc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: isLive ? 'var(--green-bright)' : 'var(--text-faint)',
            marginTop: 6,
          }}>
            {isLive
              ? match.status === 'HT' ? 'Half Time' : 'In Progress'
              : isDone ? match.status
              : new Date(match.dateUtc).toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </div>
        </div>

        {/* Away */}
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <TeamLogo src={match.awayTeam.flagUrl} alt={match.awayTeam.name} size={48} />
          </div>
          <div style={{
            fontFamily: 'var(--font-head)',
            fontSize: 15,
            fontWeight: 700,
            color: 'var(--text)',
          }}>
            {match.awayTeam.name}
          </div>
        </div>
      </div>

      {/* Venue */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: isLive ? 'var(--text-sec)' : 'var(--text-faint)',
        textAlign: 'center',
        marginTop: 16,
      }}>
        {match.venue}, {match.city}
      </div>
    </Link>
  )
}

function FeaturedStoryCard({ story, langPrefix }: { story: NewsCardData; langPrefix: string }) {
  return (
    <Link
      href={`${langPrefix}/world-cup/news/${story.slug}`}
      style={{
        display: 'block',
        textDecoration: 'none',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* Image */}
      {story.imageUrl && (
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          overflow: 'hidden',
          background: 'var(--card-alt)',
        }}>
          <Image
            src={story.imageUrl}
            alt={story.title || 'Featured story'}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 800px"
          />
          {/* Category chip */}
          {story.category && (
            <div style={{ position: 'absolute', bottom: 12, left: 12 }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--text)',
                background: 'var(--green)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
              }}>
                {story.category}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Text */}
      <div style={{ padding: '16px 20px' }}>
        <h2 style={{
          fontFamily: 'var(--font-head)',
          fontSize: 22,
          fontWeight: 800,
          fontStyle: 'italic',
          color: 'var(--text)',
          lineHeight: 1.2,
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {story.title}
        </h2>
        {story.excerpt && (
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: 'var(--text-sec)',
            lineHeight: 1.5,
            margin: '8px 0 0',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {story.excerpt}
          </p>
        )}
      </div>
    </Link>
  )
}

export function HeroFeature({ featuredMatch, featuredStory, langPrefix }: Props) {
  if (!featuredMatch && !featuredStory) return null

  return (
    <section aria-label="Featured" style={{ marginBottom: 'var(--section-gap)' }}>
      {featuredMatch && <FeaturedMatchCard match={featuredMatch} langPrefix={langPrefix} />}
      {!featuredMatch && featuredStory && <FeaturedStoryCard story={featuredStory} langPrefix={langPrefix} />}
    </section>
  )
}
