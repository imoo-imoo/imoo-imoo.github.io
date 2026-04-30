
/*
    @TEMPLATE NAME: Unic – NFT Marketplace PWA Mobile Template
    @AUTHER: ORINO STUDIO
    @DEVELOPED BY: HASAN SIBAKHI
    @DEVELOPED URL: https://dribbble.com/HasanSib
*/

/*=========================================================================
** YOU CAN FIND, DETAILED, AND WORKING EXAMPLES OF
** SERVICE WORKER USAGE ON https://github.com/mozilla/serviceworker-cookbook
===========================================================================*/
// CACHE NAME
const staticCacheName = 'cache-version-3.0';
const dynamicCacheName = 'cache-dynamic-3.0';
//FILE REQUIRED TO MAKE THIS APP WORK OFFLINE
const ASSETS_FILES = [
    'index.html',
    './',
    'assets/css/remixicon.min.css',
    'assets/css/style.css',
    'assets/vendors/swiper/swiper-bundle.min.css',
    'assets/fonts/remixicon.ttf',
    'assets/fonts/remixicon.woff',
    'assets/fonts/remixicon.woff2',
    'assets/fonts/remixicon.eot',
    'assets/js/bootstrap.bundle.min.js',
    'assets/vendors/swiper/swiper-bundle.min.js',
    'assets/js/custom.js',
    'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap',
    'images/icons/light_empty_fallback.png',
    'fallback.html',
];

// INSTALL SERVICE WORKER
self.addEventListener('install', event => {
    //console.log('service worker has been installed');
    event.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('caching shell assets');
            cache.addAll(ASSETS_FILES);
        })
    );
});

// ACTIVATE EVENT
self.addEventListener('activate', event => {
    // console.log('service worker has been activated');
    event.waitUntil(
        caches.keys().then(keys => {
            // console.log(keys);
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            )
        })
    );
});

// FETCH EVENT
self.addEventListener('fetch', event => {
    //console.log('fetch event', event);
    event.respondWith(
        caches.match(event.request).then(cacheRes => {
            return cacheRes || fetch(event.request).then(fetchRes => {
                return caches.open(dynamicCacheName).then(cache => {
                    cache.put(event.request.url, fetchRes.clone());
                    return fetchRes;
                })
            });
        }).catch(() => {
            if (event.request.url.indexOf('.html') > -1) {
                return caches.match('fallback.html');
            }
        })
    );
});