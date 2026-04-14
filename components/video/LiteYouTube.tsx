'use client'

/**
 * Lite YouTube embed — zero JS loaded until user clicks play.
 *
 * Shows a thumbnail with a play button overlay. On click, replaces
 * with the actual YouTube iframe (youtube-nocookie.com for privacy).
 * Saves ~500KB on initial page load vs a standard YouTube embed.
 */

import { useState } from 'react'

interface Props {
  videoId: string
  title?: string
  /** Custom frame URL (viral frame from video). Falls back to YouTube default. */
  frameUrl?: string
}

export function LiteYouTube({ videoId, title = '', frameUrl }: Props) {
  const [playing, setPlaying] = useState(false)

  const thumbnail = frameUrl ?? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  if (playing) {
    return (
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 'var(--radius, 8px)', overflow: 'hidden', background: '#000' }}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16/9',
        borderRadius: 'var(--radius, 8px)',
        overflow: 'hidden',
        background: '#000',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        display: 'block',
      }}
    >
      {/* Thumbnail */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbnail}
        alt={title}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.6))',
        }}
      />

      {/* Play button */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 68,
          height: 48,
          background: 'rgba(193, 18, 31, 0.9)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s ease, transform 0.2s ease',
        }}
      >
        <svg width={24} height={24} viewBox="0 0 24 24" fill="white">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>

      {/* YouTube logo watermark */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'rgba(255,255,255,0.7)',
          letterSpacing: '0.04em',
        }}
      >
        YouTube
      </div>
    </button>
  )
}
