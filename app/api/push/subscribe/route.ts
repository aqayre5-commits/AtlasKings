import { NextRequest, NextResponse } from 'next/server'
import {
  savePushSubscription,
  removePushSubscription,
  getPushSubscriptionCount,
} from '@/lib/db/push-subscriptions'

interface PushSubscription {
  endpoint: string
  keys: { p256dh: string; auth: string }
}

// POST /api/push/subscribe — save a subscription (persisted in Neon DB)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subscription, categories, lang } = body as {
      subscription: PushSubscription
      categories: string[]
      lang: string
    }

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 })
    }

    await savePushSubscription(
      subscription,
      categories ?? ['breaking'],
      lang ?? 'en',
    )

    console.log(`[Push] Subscription saved: ${subscription.endpoint.slice(0, 40)}… (${lang}, ${(categories ?? []).join(', ')})`)

    return NextResponse.json({ success: true, message: 'Subscribed successfully' })
  } catch (err) {
    console.error('[Push] Subscribe error:', err)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}

// DELETE /api/push/subscribe — remove a subscription
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const endpoint = body.endpoint as string
    if (endpoint) {
      await removePushSubscription(endpoint)
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 })
  }
}

// GET /api/push/subscribe — get subscription count
export async function GET() {
  try {
    const count = await getPushSubscriptionCount()
    return NextResponse.json({
      count,
      message: `${count} active subscriptions`,
    })
  } catch {
    return NextResponse.json({ count: 0, message: 'Unable to query subscriptions' })
  }
}
