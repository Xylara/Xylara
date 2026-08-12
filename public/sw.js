importScripts('/uv/uv.bundle.js');
importScripts('/uv/uv.config.js');
importScripts('/uv/uv.sw.js');

const nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
Object.getOwnPropertyDescriptor = function(target, prop) {
    const desc = nativeGetOwnPropertyDescriptor(target, prop);
    if (desc) return desc;
    return {
        configurable: true,
        enumerable: true,
        writable: true,
        value: () => {},
        get: () => {},
        set: () => {}
    };
};

const stubProto = () => function() {};
['Element', 'HTMLElement', 'HTMLIFrameElement', 'HTMLMediaElement', 'Storage', 'Attr', 'Node', 'Document'].forEach(className => {
    if (typeof self[className] === 'undefined') {
        self[className] = stubProto();
    }
});

importScripts('/scram/scramjet.js');

const uv = new UVServiceWorker();

const WorkerClass = $scramjet.ScramjetServiceWorker || $scramjet.Worker || $scramjet;
const scramjet = new WorkerClass();

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

async function handleRequest(event) {
    if (uv.route(event)) {
        return await uv.fetch(event);
    }
    try {
        await scramjet.loadConfig();
        if (scramjet.route(event)) {
            return await scramjet.fetch(event);
        }
    } catch (err) {
        console.error("Scramjet SW error:", err);
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
