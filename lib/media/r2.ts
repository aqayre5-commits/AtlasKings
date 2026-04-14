/**
 * Cloudflare R2 client — S3-compatible object storage for media assets.
 */
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const ACCOUNT_ID = process.env.CLOUDFLARE_R2_ACCOUNT_ID ?? ''
const ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ?? ''
const SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ?? ''
const BUCKET = process.env.CLOUDFLARE_R2_BUCKET_NAME ?? 'atlas-kings-media'
const PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL ?? ''

let _client: S3Client | null = null

function getClient(): S3Client {
  if (!_client) {
    if (!ACCOUNT_ID || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
      throw new Error('R2 credentials not configured. Set CLOUDFLARE_R2_* env vars.')
    }
    _client = new S3Client({
      region: 'auto',
      endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
      },
    })
  }
  return _client
}

/**
 * Check if R2 is configured.
 */
export function isR2Configured(): boolean {
  return !!(ACCOUNT_ID && ACCESS_KEY_ID && SECRET_ACCESS_KEY && PUBLIC_URL)
}

/**
 * Upload a file to R2.
 */
export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string = 'image/webp',
): Promise<string> {
  const client = getClient()
  await client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }))
  return getPublicUrl(key)
}

/**
 * Delete a file from R2.
 */
export async function deleteFromR2(key: string): Promise<void> {
  const client = getClient()
  await client.send(new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  }))
}

/**
 * Get the public CDN URL for an R2 key.
 */
export function getPublicUrl(key: string): string {
  const base = PUBLIC_URL.replace(/\/$/, '')
  return `${base}/${key}`
}

/**
 * Generate a storage key for a media asset.
 * Example: "players/9/hero_1600.webp" or "teams/42/original.png"
 */
export function generateMediaKey(
  entityType: string,
  apiFootballId: number | string,
  variant: 'original' | 'hero_1600' | 'card_800' | 'thumb_400' | 'square_600',
  ext: string = 'webp',
): string {
  return `${entityType}/${apiFootballId}/${variant}.${ext}`
}
