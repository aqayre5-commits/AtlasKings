/**
 * Video hero — replaces ArticleHero when article has a YouTube video.
 * Shows a lite YouTube embed with the same styling as ArticleHero.
 */

import { LiteYouTube } from './LiteYouTube'

interface Props {
  videoId: string
  title: string
  category: string
  /** Custom frame URL (viral frame). Falls back to YouTube default. */
  frameUrl?: string
}

export function VideoHero({ videoId, title, category, frameUrl }: Props) {
  return (
    <div style={{ marginBottom: 20 }}>
      {/* Category kicker above video */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--red, #c1121f)',
          marginBottom: 8,
        }}
      >
        {category}
      </div>

      {/* Video embed */}
      <LiteYouTube
        videoId={videoId}
        title={title}
        frameUrl={frameUrl}
      />
    </div>
  )
}
