const APP_URL = '/'

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = new URL(event.notification.data?.url || APP_URL, self.location.origin).href

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      const matchingClient = windowClients.find((client) => client.url.startsWith(self.location.origin))

      if (matchingClient) {
        return matchingClient.focus().then(() => matchingClient.navigate(targetUrl))
      }

      return self.clients.openWindow(targetUrl)
    }),
  )
})
