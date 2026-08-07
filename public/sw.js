importScripts('/uv/uv.bundle.js');
importScripts('/uv/uv.config.js');
importScripts('/uv/uv.sw.js');
importScripts('/scram/scramjet.all.js');

const uv = new UVServiceWorker();
const { ScramjetServiceWorker: SJWorker } = $scramjetLoadWorker();
const scramjet = new SJWorker();

let scramjetInitPromise = scramjet.loadConfig().catch(() => {});

self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
});

async function handleRequest(event) {
    if (uv.route(event)) {
        return await uv.fetch(event);
    }

    try {
        await scramjetInitPromise;
    } catch (e) {}

    if (scramjet.config && scramjet.route(event)) {
        return await scramjet.fetch(event);
    }

    return await fetch(event.request);
}

self.addEventListener("fetch", (event) => {
    event.respondWith(
        handleRequest(event).catch(() => {
            return fetch(event.request);
        })
    );
});
