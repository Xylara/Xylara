importScripts('/uv/uv.bundle.js');
importScripts('/uv/uv.config.js');
importScripts('/uv/uv.sw.js');
importScripts('/controller/controller.sw.js');

const uv = new UVServiceWorker();

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (event) => {
    if (uv.route(event)) {
        event.respondWith(uv.fetch(event));
        return;
    }
    if (typeof $scramjetController !== "undefined" && $scramjetController.shouldRoute(event)) {
        event.respondWith($scramjetController.route(event));
        return;
    }
});
