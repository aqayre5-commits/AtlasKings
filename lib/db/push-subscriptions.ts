import { query, execute, queryOne } from './client'

/**
 * Push subscription database operations.
 *
 * Required table (run once):
 * CREATE TABLE IF NOT EXISTS atlas.push_subscriptions (
 *   endpoint TEXT PRIMARY KEY,
 *   keys_p256dh TEXT NOT NULL,
 *   keys_auth TEXT NOT NULL,
 *   categories TEXT[] DEFAULT '{breaking}',
 *   lang VARCHAR(2) DEFAULT 'en',
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 */

interface PushSubscriptionRecord {
  endpoint: string
  keys_p256dh: string
  keys_auth: string
  categories: string[]
  lang: string
  created_at: string
}

interface PushSubscriptionInput {
  endpoint: string
  keys: { p256dh: string; auth: string }
}

export async function savePushSubscription(
  subscription: PushSubscriptionInput,
  categories: string[] = ['breaking'],
  lang: string = 'en',
): Promise<void> {
  await execute(
    `INSERT INTO atlas.push_subscriptions (endpoint, keys_p256dh, keys_auth, categories, lang)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (endpoint) DO UPDATE SET
       keys_p256dh = EXCLUDED.keys_p256dh,
       keys_auth = EXCLUDED.keys_auth,
       categories = EXCLUDED.categories,
       lang = EXCLUDED.lang`,
    [subscription.endpoint, subscription.keys.p256dh, subscription.keys.auth, categories, lang],
  )
}

export async function removePushSubscription(endpoint: string): Promise<void> {
  await execute(
    'DELETE FROM atlas.push_subscriptions WHERE endpoint = $1',
    [endpoint],
  )
}

export async function getPushSubscriptionCount(): Promise<number> {
  const row = await queryOne<{ count: string }>(
    'SELECT COUNT(*)::text AS count FROM atlas.push_subscriptions',
    [],
  )
  return parseInt(row?.count ?? '0', 10)
}

export async function getPushSubscriptions(
  category?: string,
  lang?: string,
): Promise<PushSubscriptionRecord[]> {
  let sql = 'SELECT * FROM atlas.push_subscriptions WHERE 1=1'
  const params: (string | string[])[] = []
  let idx = 1

  if (category) {
    sql += ` AND $${idx} = ANY(categories)`
    params.push(category)
    idx++
  }
  if (lang) {
    sql += ` AND lang = $${idx}`
    params.push(lang)
    idx++
  }

  return query<PushSubscriptionRecord>(sql, params)
}
