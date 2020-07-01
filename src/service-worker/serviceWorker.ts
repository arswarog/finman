import { ApplicationUpdateService } from './application';

/// <reference lib="webworker" />
declare var self: ServiceWorkerGlobalScope;

const updateService = new ApplicationUpdateService();

const CACHE_NAME = 'v1';

console.log('SW ts 6');
console.log(location);

self.addEventListener('install', (event) => {
    console.log('install', event);
    event.waitUntil(
        new Promise(async (resolve, reject) => {
            const assetManifest = await fetch('./asset-manifest.json')
                .then(req => req.json());
            const files = Object
                .entries(assetManifest.files)
                .map(item => item as any)
                .map(([key, path]: [string, string]) => {
                    if (key.substr(-4) === '.map')
                        return '';
                    return path;
                })
                .filter(path => !!path);
            files.unshift(
                '/finman/',
                '/finman/manifest.json',
                '/finman/favicon.ico',
                '/finman/logo192.png',
                '/finman/logo512.png',
            );
            console.log(files);
            const caching = await caches.open(CACHE_NAME)
                                        .then(
                                            async cache => {
                                                console.time('precaching');
                                                console.log('cache ready. precaching');
                                                const x = await cache.addAll(files);
                                                console.timeEnd('precaching');
                                                return x;
                                            },
                                        );
            resolve();
        }),
    );
});
self.addEventListener('activate', (event) => {
    console.log('activate', event);
    updateService.init();

    event.waitUntil(
        caches.keys()
              .then(cacheNames => Promise.all(
                  cacheNames
                      .filter(cacheName => true)
                      .map(cacheName => caches.delete(cacheName)),
              )),
    );
    
    fetch('./asset-manifest.json')
        .then(req => req.json())
        .then(console.log);
});
self.addEventListener('activate', (event) => {
    event.waitUntil(
        // Получение всех ключей из кэша.
        caches.keys().then((cacheNames) => Promise.all(
            // Прохождение по всем кэшированным файлам.
            cacheNames.map(cacheName => caches.delete(cacheName)),
            ),
        ),
    );
});
self.addEventListener('message', (event) => {
    console.log('message', event);
});
self.addEventListener('sync', (event) => {
    console.log('sync', event);
});
self.addEventListener('push', (event) => {
    console.log('push', event);
});
self.addEventListener('fetch', (event: FetchEvent) => {
    event.respondWith(fromAuto(event.request));
});

function fromAuto(request: FetchEvent['request']): any {
    console.log(request.url);
    if (request.url.substr(0, 19) === 'chrome-extension://')
        return fromNetwork(request);
    else
        return fromCache(request);
}

function fromCache(request: FetchEvent['request']) {
    return caches.open(CACHE_NAME).then((cache) =>
        cache.match(request)
             .then((matching) => matching || Promise.reject('no-match')),
    );
}

function fromNetwork(request: FetchEvent['request']): any {
    return fetch(request);
}

export default void 0;
