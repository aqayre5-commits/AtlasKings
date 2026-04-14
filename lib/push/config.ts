// Web Push Notification system for Atlas Kings
// Uses the Web Push Protocol (VAPID)
//
// Setup:
// 1. Generate VAPID keys: npx web-push generate-vapid-keys
// 2. Add to .env.local:
//    NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key
//    VAPID_PRIVATE_KEY=your_private_key
//    VAPID_EMAIL=mailto:editorial@atlaskings.com

export const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''

// Notification categories users can subscribe to
export type NotificationCategory =
  | 'breaking'      // Breaking news (all languages)
  | 'morocco'       // Morocco / Atlas Lions news
  | 'botola'        // Botola Pro goals and results
  | 'ucl'           // Champions League
  | 'wc2030'        // World Cup 2030

export const NOTIFICATION_CATEGORIES: {
  key: NotificationCategory
  label: { en: string; ar: string; fr: string }
  icon: string
}[] = [
  {
    key: 'breaking',
    label: { en: 'Breaking News', ar: 'أخبار عاجلة', fr: 'Infos en direct' },
    icon: '🔴',
  },
  {
    key: 'morocco',
    label: { en: 'Morocco & Atlas Lions', ar: 'المغرب وأسود الأطلس', fr: 'Maroc & Lions de l\'Atlas' },
    icon: '🇲🇦',
  },
  {
    key: 'botola',
    label: { en: 'Botola Pro', ar: 'البطولة المحترفة', fr: 'Botola Pro' },
    icon: '🏆',
  },
  {
    key: 'ucl',
    label: { en: 'Champions League', ar: 'دوري أبطال أوروبا', fr: 'Ligue des Champions' },
    icon: '⭐',
  },
  {
    key: 'wc2030',
    label: { en: 'World Cup 2030', ar: 'كأس العالم 2030', fr: 'Coupe du Monde 2030' },
    icon: '🌍',
  },
]

// Notification payload shape
export interface PushNotificationPayload {
  title: string
  body: string
  url: string
  icon?: string
  badge?: string
  category: NotificationCategory
  lang: string
}
