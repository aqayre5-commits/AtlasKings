/**
 * Image processing — download, inspect, resize, quality assessment.
 * Uses sharp for all image operations.
 */
import sharp from 'sharp'

export interface ImageMetadata {
  width: number
  height: number
  fileSize: number
  format: string
  aspectRatio: number
}

export interface DerivedImages {
  hero_1600: Buffer
  card_800: Buffer
  thumb_400: Buffer
  square_600: Buffer
}

/**
 * Download an image from a URL and return it as a Buffer.
 */
export async function downloadImage(url: string): Promise<Buffer> {
  const headers: Record<string, string> = {
    'User-Agent': 'AtlasKings/1.0 MediaFetcher',
  }

  // API-Football media CDN may require auth headers
  if (url.includes('api-sports.io')) {
    const apiKey = process.env.APIFOOTBALL_KEY
    if (apiKey) {
      headers['x-apisports-key'] = apiKey
      headers['x-rapidapi-host'] = 'v3.football.api-sports.io'
    }
  }

  const res = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`)
  const arrayBuffer = await res.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

/**
 * Extract metadata from an image buffer.
 */
export async function getImageMetadata(buffer: Buffer): Promise<ImageMetadata> {
  const meta = await sharp(buffer).metadata()
  const width = meta.width ?? 0
  const height = meta.height ?? 0
  return {
    width,
    height,
    fileSize: buffer.length,
    format: meta.format ?? 'unknown',
    aspectRatio: height > 0 ? +(width / height).toFixed(4) : 0,
  }
}

/**
 * Generate all derived sizes as WebP.
 * hero = 1600w (maintain aspect)
 * card = 800w (maintain aspect)
 * thumb = 400w (maintain aspect)
 * square = 600×600 center-crop
 */
export async function generateDerivedSizes(buffer: Buffer): Promise<DerivedImages> {
  const [hero, card, thumb, square] = await Promise.all([
    sharp(buffer).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer(),
    sharp(buffer).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 78 }).toBuffer(),
    sharp(buffer).resize({ width: 400, withoutEnlargement: true }).webp({ quality: 72 }).toBuffer(),
    sharp(buffer).resize({ width: 600, height: 600, fit: 'cover', position: 'top' }).webp({ quality: 78 }).toBuffer(),
  ])
  return { hero_1600: hero, card_800: card, thumb_400: thumb, square_600: square }
}

/**
 * Assess image quality. Returns a score from 0–100.
 * Factors: resolution, file size (proxy for compression artifacts), aspect ratio suitability.
 */
export async function assessQuality(buffer: Buffer, meta: ImageMetadata): Promise<{
  qualityScore: number
  sharpnessScore: number
  resolutionAdequate: boolean
}> {
  // Resolution score: 0–35 points
  // ≥1200px wide → 35, ≥800 → 28, ≥400 → 18, <400 → 8
  const resScore = meta.width >= 1200 ? 35
    : meta.width >= 800 ? 28
    : meta.width >= 400 ? 18
    : 8

  // File-size-to-pixel ratio (proxy for compression/sharpness): 0–25 points
  // Higher bytes-per-pixel generally = less compressed = sharper
  const totalPixels = meta.width * meta.height
  const bpp = totalPixels > 0 ? meta.fileSize / totalPixels : 0
  const sharpnessScore = Math.min(25, Math.round(bpp * 8))

  // Aspect ratio suitability for article hero (16:9 ideal, square ok): 0–20 points
  const ar = meta.aspectRatio
  const arScore = ar >= 1.3 && ar <= 2.0 ? 20
    : ar >= 0.9 && ar <= 1.1 ? 15 // square
    : ar >= 0.7 ? 10
    : 5

  // Format bonus: 0–10 points
  const formatScore = ['webp', 'png', 'jpeg', 'jpg'].includes(meta.format) ? 10 : 5

  // Minimum dimension bonus: 0–10 points
  const minDim = Math.min(meta.width, meta.height)
  const dimScore = minDim >= 600 ? 10 : minDim >= 300 ? 7 : minDim >= 150 ? 4 : 2

  const qualityScore = Math.min(100, resScore + sharpnessScore + arScore + formatScore + dimScore)
  const resolutionAdequate = meta.width >= 400 && meta.height >= 300

  return {
    qualityScore,
    sharpnessScore,
    resolutionAdequate,
  }
}
