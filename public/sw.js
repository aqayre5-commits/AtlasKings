// Atlas Kings Service Worker
// Handles push notifications and offline caching

const CACHE_NAME = 'atlas-kings-v1'
const SITE_URL = self.location.origin

// ── INSTALL ──
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll([
        '/',
        '/images/og-default.jpg',
      ])
    )
  )
  self.skipWaiting()
})

// ── ACTIVATE ──
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  )
  self.clients.claim()
})

// ── FETCH — cache-first for static assets ──
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  // Only cache same-origin GET requests for static files
  if (event.request.method !== 'GET') return
  if (!url.origin.includes(SITE_URL)) return
  if (url.pathname.startsWith('/api/')) return

  // Network-first for HTML pages
  if (event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/'))
    )
    return
  }

  // Cache-first for images and static assets
  if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|woff2?)$/)) {
    event.respondWith(
      caches.match(event.request).then(cached =>
        cached ?? fetch(event.request).then(response => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
          return response
        })
      )
    )
  }
})

// ── PUSH NOTIFICATION ──
self.addEventListener('push', (event) => {
  if (!event.data) return

  let payload
  try {
    payload = event.data.json()
  } catch {
    payload = {
      title: 'Atlas Kings',
      body: event.data.text(),
      url: '/',
      icon: '/images/icon-192.png',
    }
  }

  const options = {
    body: payload.body,
    icon: payload.icon ?? '/images/icon-192.png',
    badge: payload.badge ?? '/images/badge-72.png',
    data: { url: payload.url ?? '/' },
    tag: payload.category ?? 'general',
    renotify: true,
    requireInteraction: payload.category === 'breaking',
    actions: [
      { action: 'read', title: 'Read now' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
    vibrate: [200, 100, 200],
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  )
})

// ── NOTIFICATION CLICK ──
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'dismiss') return

  const url = event.notification.data?.url ?? '/'
  const fullUrl = url.startsWith('http') ? url : `${SITE_URL}${url}`

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clients => {
        // Focus existing tab if already open
        const existing = clients.find(c => c.url === fullUrl)
        if (existing) return existing.focus()
        // Otherwise open new tab
        return self.clients.openWindow(fullUrl)
      })
  )
})
