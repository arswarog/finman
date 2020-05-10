/// <reference lib="webworker" />
declare var self: ServiceWorkerGlobalScope;

export class ApplicationUpdateService {
    constructor() {}

    init() {
        self.addEventListener('fetch', (event: FetchEvent) => {
            console.log(event.request.url);
            event.respondWith(
                caches.match(event.request).then((response) => {
                    return response || fetch(event.request);
                })
            );
        });
    }
}
