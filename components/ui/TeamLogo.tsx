import Image from 'next/image'

interface TeamLogoProps {
  src?: string
  alt: string
  size?: number
}

export function TeamLogo({ src, alt, size = 20 }: TeamLogoProps) {
  if (!src) return null
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      style={{ objectFit: 'contain', flexShrink: 0 }}
      unoptimized
    />
  )
}
