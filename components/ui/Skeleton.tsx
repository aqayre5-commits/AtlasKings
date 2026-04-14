interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: string | number
  className?: string
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 'var(--radius-sm)', className }: SkeletonProps) {
  return (
    <div
      className={className}
      style={{
        width, height, borderRadius,
        background: 'linear-gradient(90deg, var(--card-alt) 25%, var(--card-hover) 50%, var(--card-alt) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s ease-in-out infinite',
      }}
    />
  )
}

/** Skeleton for a story card (mobile-first) */
export function SkeletonStoryCard() {
  return (
    <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
      <Skeleton height={180} borderRadius={0} />
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Skeleton width="30%" height={10} />
        <Skeleton height={16} />
        <Skeleton width="85%" height={16} />
        <Skeleton width="60%" height={12} />
        <Skeleton width="25%" height={10} />
      </div>
    </div>
  )
}

/** Skeleton for a fixture card (mobile-first) */
export function SkeletonFixtureCard() {
  return (
    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Skeleton width={20} height={20} borderRadius="50%" />
          <Skeleton width="60%" height={14} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Skeleton width={20} height={20} borderRadius="50%" />
          <Skeleton width="55%" height={14} />
        </div>
      </div>
      <div style={{ width: 56, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <Skeleton width={30} height={16} />
        <Skeleton width={30} height={16} />
      </div>
    </div>
  )
}

/** Skeleton for a live match hero card */
export function SkeletonLiveMatch() {
  return (
    <div style={{ padding: 20, background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
      <Skeleton width="40%" height={10} borderRadius="var(--radius-sm)" />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 16 }}>
        <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <Skeleton width={44} height={44} borderRadius="50%" />
          <Skeleton width={80} height={12} />
        </div>
        <Skeleton width={80} height={36} />
        <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <Skeleton width={44} height={44} borderRadius="50%" />
          <Skeleton width={80} height={12} />
        </div>
      </div>
    </div>
  )
}

export function SkeletonCard() {
  return <SkeletonStoryCard />
}

export function SkeletonTable({ rows = 6 }: { rows?: number }) {
  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Skeleton height={32} borderRadius="var(--radius-sm)" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height={44} borderRadius="var(--radius-sm)" />
      ))}
    </div>
  )
}

export function SkeletonWidget({ height = 400 }: { height?: number }) {
  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12, minHeight: height }}>
      <Skeleton height={36} width="50%" />
      <Skeleton height={1} />
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonFixtureCard key={i} />
      ))}
    </div>
  )
}
