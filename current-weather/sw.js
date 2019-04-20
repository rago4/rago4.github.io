const ICONS_PATHS = [72, 96, 128, 144, 152, 192, 384, 512].map(size => `images/icons/icon-${size}x${size}.png`);
const CACHE_NAME = 'v1';
const CACHE_ASSETS = [
    'index.html',
    'manifest.json',
    'dist/main.css',
    'dist/bundle.js',
    ...ICONS_PATHS,
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(CACHE_ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            )
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request).catch(() => catches.match(event.request))
    );
});