importScripts('/uv/uv.bundle.js');
importScripts('/uv/uv.config.js');
importScripts('/uv/uv.sw.js');
importScripts('/meteor/meteor.codecs.js')
importScripts('/meteor/meteor.config.js')
importScripts('/meteor/meteor.bundle.js')
importScripts('/meteor/meteor.worker.js')
importScripts("/scram/scramjet.wasm.js", "/scram/scramjet.shared.js", "/scram/scramjet.worker.js");

const uv = new UVServiceWorker();
const scramjet = new ScramjetServiceWorker();
const meteor = new MeteorServiceWorker()

let playgroundData;

self.addEventListener("message", ({ data }) => {
    if (data.type === "playgroundData") {
        playgroundData = data;
    }
});

async function handleRequest(event) {
    if (uv.route(event)) {
        return await uv.fetch(event);
    }

    await scramjet.loadConfig();
    if (scramjet.route(event)) {
        return await scramjet.fetch(event);
    }

    if (meteor.shouldRoute(event)) {
        return meteor.handleFetch(event)
      }
    return await fetch(event.request);
}

self.addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event));
});
