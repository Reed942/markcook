console.log('Script loaded!')
var cacheStorageKey = 'markcook-2'

var cacheList = [
  '/',
  "index.html",
  "dist/build.js",
  'https://cdn.bootcss.com/font-awesome/4.6.3/css/font-awesome.min.css',
  'https://cdn.bootcss.com/font-awesome/4.6.3/fonts/fontawesome-webfont.woff2?v=4.6.3',
  'https://cdn.bootcss.com/font-awesome/4.6.3/fonts/fontawesome-webfont.ttf?v=4.6.3',
  'https://cdn.bootcss.com/highlight.js/9.7.0/styles/atom-one-dark.min.css'
]

self.addEventListener('install', function(e) {
  console.log('Cache event!')
  e.waitUntil(
    caches.open(cacheStorageKey).then(function(cache) {
      console.log('Adding to Cache:', cacheList)
      return cache.addAll(cacheList)
    }).then(function() {
      console.log('Skip waiting!')
      return self.skipWaiting()
    })
  )
})

self.addEventListener('activate', function(e) {
  console.log('Activate event')
  e.waitUntil(
    Promise.all([
      clients.claim(),
      caches.keys().then(cacheList => {
        Promise.all(cacheList.map(cacheName => {
          if (cacheName !== cacheStorageKey) {
            caches.delete(cacheName)
          }
        }))
      })
    ])
  )
})

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response != null) {
        console.log('Using cache for:', e.request.url)
        return response
      }
      console.log('Fallback to fetch:', e.request.url)
      return fetch(e.request.url)
    })
  )
})
