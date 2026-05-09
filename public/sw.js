const CACHE_NAME = "padipay-v2";
const STATIC_ASSETS = ["/", "/index.html"];

// Do NOT cache API calls — only cache static assets (HTML, CSS, JS, fonts, images)
const CACHEABLE_ORIGINS = [
  self.location.origin,
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip Supabase API calls and Edge Functions — these must always be fresh
  const url = new URL(request.url);
  if (url.hostname.includes("supabase")) return;
  if (url.pathname.startsWith("/rest/") || url.pathname.startsWith("/auth/")) return;

  // Skip Paystack
  if (url.hostname.includes("paystack")) return;

  // Network-first strategy for navigations (HTML pages)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  // Stale-while-revalidate for static assets (JS, CSS, fonts, images)
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          // Only cache successful responses from cacheable origins
          if (response.ok && CACHEABLE_ORIGINS.some((o) => request.url.startsWith(o))) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
