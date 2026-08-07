importScripts('/uv/uv.bundle.js');
importScripts('/uv/uv.config.js');
importScripts('/uv/uv.sw.js');
importScripts('/scram/scramjet.all.js');

const uv = new UVServiceWorker();
const { ScramjetServiceWorker: SJWorker } = $scramjetLoadWorker();
const scramjet = new SJWorker();

let scramjetInitPromise = scramjet.loadConfig().catch((err) => {
    console.warn("Initial Scramjet config load deferred:", err);
});

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

    if (scramjet.route(event)) {
        await scramjetInitPromise;
        return await scramjet.fetch(event);
    }

    return await fetch(event.request);
}

self.addEventListener("fetch", (event) => {
    event.respondWith(
        handleRequest(event).catch((err) => {
            console.error("SW Fetch handling failed:", err);
            return fetch(event.request);
        })
    );
});
