import { NextRequest, NextResponse } from 'next/server'
import type { PushNotificationPayload, NotificationCategory } from '@/lib/push/config'

// This endpoint sends a push notification to all matching subscribers
// Protect with a secret key in production

interface SendBody {
  title: string
  body: string
  url: string
  category: NotificationCategory
  lang?: string        // 'en' | 'ar' | 'fr' | undefined (all)
  secret: string       // Must match PUSH_SECRET env var
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as SendBody

    // Verify secret to prevent unauthorized sends
    const secret = process.env.PUSH_SECRET
    if (!secret || body.secret !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // In production: fetch subscriptions from database, filter by category/lang
    // Then use web-push library to send:
    //
    // import webpush from 'web-push'
    // webpush.setVapidDetails(
    //   process.env.VAPID_EMAIL!,
    //   process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    //   process.env.VAPID_PRIVATE_KEY!
    // )
    //
    // const payload: PushNotificationPayload = {
    //   title: body.title,
    //   body: body.body,
    //   url: body.url,
    //   category: body.category,
    //   lang: body.lang ?? 'en',
    // }
    //
    // const results = await Promise.allSettled(
    //   matchingSubscriptions.map(sub =>
    //     webpush.sendNotification(sub.subscription, JSON.stringify(payload))
    //   )
    // )

    console.log('[Push] Would send notification:', {
      title: body.title,
      category: body.category,
      lang: body.lang ?? 'all',
    })

    return NextResponse.json({
      success: true,
      message: 'Notification queued. Install web-push package to activate.',
      note: 'Run: npm install web-push && npm install -D @types/web-push',
    })
  } catch (err) {
    console.error('[Push] Send error:', err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
