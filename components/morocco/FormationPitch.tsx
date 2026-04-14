/**
 * SVG football pitch showing Morocco's predicted 4-3-3 starting XI.
 * Pure server component — tap-to-jump uses anchor links, no JS needed.
 */

import { STATUS_CONFIG, type FormationPlayer } from '@/lib/data/morocco-squad'

interface Props {
  players: FormationPlayer[]
}

// SVG viewBox dimensions
const W = 400
const H = 560

export function FormationPitch({ players }: Props) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', maxWidth: 500, height: 'auto', display: 'block', margin: '0 auto' }}
      role="img"
      aria-label="Morocco predicted starting XI in 4-3-3 formation"
    >
      {/* Pitch background */}
      <rect x={0} y={0} width={W} height={H} rx={12} fill="#1a472a" />

      {/* Pitch markings — white at 15% opacity */}
      <g stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} fill="none">
        {/* Outer boundary */}
        <rect x={20} y={20} width={W - 40} height={H - 40} rx={4} />
        {/* Halfway line */}
        <line x1={20} y1={H / 2} x2={W - 20} y2={H / 2} />
        {/* Centre circle */}
        <circle cx={W / 2} cy={H / 2} r={50} />
        {/* Centre spot */}
        <circle cx={W / 2} cy={H / 2} r={3} fill="rgba(255,255,255,0.15)" />

        {/* Top penalty area */}
        <rect x={100} y={20} width={W - 200} height={80} />
        {/* Top goal area */}
        <rect x={140} y={20} width={W - 280} height={36} />
        {/* Top penalty arc */}
        <path d={`M 150 100 A 40 40 0 0 0 250 100`} />

        {/* Bottom penalty area */}
        <rect x={100} y={H - 100} width={W - 200} height={80} />
        {/* Bottom goal area */}
        <rect x={140} y={H - 56} width={W - 280} height={36} />
        {/* Bottom penalty arc */}
        <path d={`M 150 ${H - 100} A 40 40 0 0 1 250 ${H - 100}`} />
      </g>

      {/* Grass stripes (subtle) */}
      <g fill="rgba(255,255,255,0.02)">
        {[1, 3, 5, 7, 9].map(i => (
          <rect key={i} x={20} y={20 + i * (H - 40) / 11} width={W - 40} height={(H - 40) / 11} />
        ))}
      </g>

      {/* Player nodes */}
      {players.map(p => {
        const cx = (p.x / 100) * (W - 60) + 30
        const cy = (p.y / 100) * (H - 60) + 30
        const cfg = STATUS_CONFIG[p.status]

        return (
          <a key={p.anchorId} href={`#${p.anchorId}`} style={{ textDecoration: 'none' }}>
            <g style={{ cursor: 'pointer' }}>
              {/* Glow ring on hover (CSS handles this via SVG) */}
              <circle
                cx={cx}
                cy={cy}
                r={18}
                fill="rgba(255,255,255,0.08)"
              />
              {/* Player circle */}
              <circle
                cx={cx}
                cy={cy}
                r={14}
                fill="#ffffff"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth={2}
              />
              {/* Status dot */}
              <circle
                cx={cx + 10}
                cy={cy - 10}
                r={4}
                fill={cfg.color}
                stroke="#1a472a"
                strokeWidth={1.5}
              />
              {/* Captain badge */}
              {p.isCaptain && (
                <text
                  x={cx}
                  y={cy + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#c1121f"
                  fontSize={9}
                  fontWeight={800}
                  fontFamily="var(--font-mono)"
                >
                  C
                </text>
              )}
              {/* Player name */}
              <text
                x={cx}
                y={cy + 26}
                textAnchor="middle"
                fill="#ffffff"
                fontSize={10}
                fontWeight={700}
                fontFamily="var(--font-mono)"
                style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}
              >
                {p.name}
              </text>
            </g>
          </a>
        )
      })}
    </svg>
  )
}
