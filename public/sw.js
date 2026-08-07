importScripts('/uv/uv.bundle.js');
importScripts('/uv/uv.config.js');
importScripts('/uv/uv.sw.js');
importScripts("/scram/scramjet.js");

const uv = new UVServiceWorker();
const { ScramjetServiceWorker: SJWorker } = $scramjetLoadWorker();
const scramjet = new SJWorker();

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

    await scramjet.loadConfig();
    if (scramjet.route(event)) {
        return await scramjet.fetch(event);
    }

    return await fetch(event.request);
}

self.addEventListener("fetch", (event) => {
    event.respondWith(
        handleRequest(event).catch((err) => {
            console.error(err);
            return fetch(event.request);
        })
    );
});
