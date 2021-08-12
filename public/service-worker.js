const FILES_TO_CACHE = [
    '/',
    '/styles.css',
    '/index.js',
    '/manifest.webmanifest',
    "/icons/icon-192X192.png",
    "/icons/icon-512X512.png"
  ];
  
  const PRECACHE = 'precache-v1';
  const RUNTIME = 'runtime';
  const DATA_CACHE = "data-cache"
  
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches
        .open(PRECACHE)
        .then((cache) => cache.addAll(FILES_TO_CACHE))
        .then(self.skipWaiting())
    );
  });
  
//   The activate handler takes care of cleaning up old caches.
  self.addEventListener('activate', (event) => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
      caches
        .keys()
        .then((cacheNames) => {
          return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
        })
        .then((cachesToDelete) => {
          return Promise.all(
            cachesToDelete.map((cacheToDelete) => {
              return caches.delete(cacheToDelete);
            })
          );
        })
        .then(() => self.clients.claim())
    );
  });
  
  self.addEventListener('fetch', (event) => {
    if (event.request.url.startsWith(self.location.origin)) {
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
  
          return caches.open(RUNTIME).then((cache) => {
            return fetch(event.request).then((response) => {
              return cache.put(event.request, response.clone()).then(() => {
                return response;
              });
            });
          });
        })
      );

   
    }

    //     if (event.request.url.includes("/api/")) {
    //   event.respondWith(
    //     caches.open(DATA_CACHE).then(cache => {
    //       return fetch(event.request)
    //         .then(response => {
             
    //           if (response.status === 200) {
    //             cache.put(event.request.url, response.clone());
    //           }
  
    //           return response;
    //         })
    //         .catch(err => {
    //           // Network request failed, try to get it from the cache.
    //           return cache.match(event.request);
    //         });
    //     }).catch(err => console.log(err))
    //   );
  
    //   return;
    // }
  });

// self.addEventListener("fetch", function(event) {
//     if (event.request.url.includes("/api/")) {
//       event.respondWith(
//         caches.open(DATA_CACHE).then(cache => {
//           return fetch(event.request)
//             .then(response => {
             
//               if (response.status === 200) {
//                 cache.put(event.request.url, response.clone());
//               }
  
//               return response;
//             })
//             .catch(err => {
//               // Network request failed, try to get it from the cache.
//               return cache.match(event.request);
//             });
//         }).catch(err => console.log(err))
//       );
  
//       return;
//     }
  
  
//   });
  