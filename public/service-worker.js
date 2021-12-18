const CACHE_NAME = "budget-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/css/style.css",
  "/js/index.js",
  "/service-work.js",
  "/icons/icon-72x72.png",
  "/icons/icon-96x96.png",
  "/icons/icon-128x128.png",
  "/icons/icon144x144png",
  "/icons/icon-152x152.png",
  "/icons/icon-192x192.png",
  "/icons/icon-384x384.png",
  "/icons/icon-512x512.png",
];

// Install the service worker
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Intercept fetch requests
self.addEventListener("fetch", function (event) {
  if (event.request.url.includes("/api/")) {
    event.respondWith(DATA_CACHE_NAME).then(function (cache) {
      return fetch(event.request)
        .then(function (response) {
          if (response.status === 200) {
            cache.put(event.request.url, response.clone());
          }
          return response;
        })
        .catch(function (error) {
          return cache.match(event.request);
        });
    });
    return;
  }
  event.respondWith(
      fetch(event.request).catch(function () {
          return caches.match(event.request).then(function (response) {
              if(response) {
                  return response;
              } if (event.request.headers.get("accept").include("text/html")) {
                  return caches.match("/");
              }
          })
      })
  )
});
