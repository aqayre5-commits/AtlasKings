/**
 * Claude Vision analysis — emotion, scene, kit detection.
 * Uses Claude Haiku for cost-effective vision analysis.
 */
import Anthropic from '@anthropic-ai/sdk'
import { getPendingVisionAssets, updateMediaAsset, insertMediaTag, deleteTagsForAsset } from '@/lib/db/media'
import { downloadImage } from './processor'

const VISION_MODEL = 'claude-haiku-4-5-20251001'

interface VisionResult {
  emotion: string
  scene: string
  kit_context: string
  quality: string
  action: string | null
  multiple_people: boolean
  identity_confirmed: boolean
  confidence: number
}

const SYSTEM_PROMPT = `You are a sports image analyzer for a Moroccan football news website (Atlas Kings).
Analyze the given image and return ONLY a JSON object with these fields:

{
  "identity_confirmed": boolean (does the image clearly show one identifiable person?),
  "emotion": "neutral"|"smiling"|"celebrating"|"disappointed"|"crying"|"focused"|"angry"|"serious",
  "scene": "portrait"|"match_action"|"press_conference"|"training"|"ceremony"|"team_photo"|"stadium"|"crowd"|"logo",
  "kit_context": "morocco_home"|"morocco_away"|"club"|"training"|"formal"|"none"|"unknown",
  "quality": "high"|"medium"|"low",
  "action": "scoring"|"tackling"|"dribbling"|"passing"|"saving"|null,
  "multiple_people": boolean,
  "confidence": 0.0 to 1.0 (your overall confidence in the analysis)
}

Rules:
- For logos/badges, use scene="logo", emotion="neutral", kit_context="none"
- For stadium images, use scene="stadium", emotion="neutral"
- Morocco home kit is typically red with green accents
- Morocco away kit is typically white
- Only mark identity_confirmed=true if one clear face is visible
- Be conservative with emotion labels — use "serious" over "disappointed" when ambiguous
- Return ONLY the JSON object, no other text`

/**
 * Analyze a single image with Claude Vision.
 */
async function analyzeImage(imageBuffer: Buffer, mimeType: string): Promise<VisionResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured')

  const client = new Anthropic({ apiKey })

  const base64 = imageBuffer.toString('base64')
  const mediaType = mimeType.startsWith('image/')
    ? mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
    : 'image/png'

  const response = await client.messages.create({
    model: VISION_MODEL,
    max_tokens: 300,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: { type: 'base64', media_type: mediaType, data: base64 },
        },
        { type: 'text', text: 'Analyze this football image. Return only JSON.' },
      ],
    }],
    system: SYSTEM_PROMPT,
  })

  const text = response.content[0]?.type === 'text' ? response.content[0].text : ''

  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error(`No JSON in vision response: ${text.slice(0, 200)}`)

  return JSON.parse(jsonMatch[0]) as VisionResult
}

/**
 * Process pending vision analysis queue.
 */
export async function processVisionQueue(limit = 30): Promise<{ analyzed: number; failed: number }> {
  const pending = await getPendingVisionAssets(limit)
  let analyzed = 0
  let failed = 0

  for (const asset of pending) {
    try {
      // Download image for vision analysis
      const buffer = await downloadImage(asset.source_url)
      const mimeType = asset.mime_type || 'image/png'

      // Run Claude Vision
      const result = await analyzeImage(buffer, mimeType)

      // Clear old tags and insert new ones
      await deleteTagsForAsset(asset.id)

      const tags: { category: string; value: string; confidence: number }[] = [
        { category: 'emotion', value: result.emotion, confidence: result.confidence },
        { category: 'scene', value: result.scene, confidence: result.confidence },
        { category: 'kit', value: result.kit_context, confidence: result.confidence },
        { category: 'quality', value: result.quality, confidence: result.confidence },
        { category: 'people', value: result.multiple_people ? 'multiple' : 'single', confidence: result.confidence },
      ]

      if (result.action) {
        tags.push({ category: 'action', value: result.action, confidence: result.confidence })
      }

      for (const tag of tags) {
        await insertMediaTag({
          media_asset_id: asset.id,
          tag_category: tag.category,
          tag_value: tag.value,
          confidence: tag.confidence,
          source: 'vision',
        })
      }

      // Update asset with confidence scores and vision status
      await updateMediaAsset(asset.id, {
        identity_confidence: result.identity_confirmed ? Math.max(result.confidence, 0.8) as any : (result.confidence * 0.4) as any,
        vision_status: 'analyzed',
        analyzed_at: new Date().toISOString(),
      })

      analyzed++

      // Rate limit: 200ms between vision calls
      await new Promise(r => setTimeout(r, 200))
    } catch (err) {
      console.error(`[media/vision] Failed to analyze asset ${asset.id}:`, err)
      await updateMediaAsset(asset.id, { vision_status: 'failed' }).catch(() => {})
      failed++
    }
  }

  return { analyzed, failed }
}
