document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById("input");
    const form = document.getElementById("form");
    
    async function init() {
        try {
            const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
            const wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
            if (localStorage.getItem("transport") == "epoxy") {
                if (await connection.getTransport() !== "/epoxy/index.mjs") {
                    await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
                }
            }
            else {
                if (await connection.getTransport() !== "/libcurl/index.mjs") {
                    await connection.setTransport("/libcurl/index.mjs", [{ wisp: wispUrl }]);
                }
            }
    
        } catch (err) {
            console.error("An error occurred while setting up baremux:", err);
        }
        
        try {
            const scramjet = new ScramjetController({
                prefix: "/scram/service/",
                files: {
                    wasm: "/scram/scramjet.wasm.js",
                    worker: "/scram/scramjet.worker.js",
                    client: "/scram/scramjet.client.js",
                    shared: "/scram/scramjet.shared.js",
                    sync: "/scram/scramjet.sync.js"
                },
                flags: {
                    syncxhr: true
                }
            });
            window.sj = scramjet;
            scramjet.init("/sw.js");
    
        } catch (error) {
            console.error("Error setting up uv & sj:", error);
        }
        
        if (!localStorage.getItem("proxy")) {
            localStorage.setItem("proxy", "uv");
        }
    
        try {
            await navigator.serviceWorker.register("/sw.js");
        } catch (err) {
            throw new Error(err)
        }
    }
    init();
    
    if (form && input) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            function isUrl(val = "") {
                try {
                    new URL(val);
                    return true;
                } catch (_) {
                    return false;
                }
            }
    
            event.preventDefault();
    
            var url = input.value.trim();
    
            if (!isUrl(url)) {
                url = "https://duckduckgo.com/?q=" + encodeURIComponent(url);
            } else if (!(url.startsWith("https://") || url.startsWith("http://"))) {
                url = `https://${url}`;
            }
    
            if (localStorage.getItem("proxy") == "uv") {
                url = __uv$config.prefix + __uv$config.encodeUrl(url);
            }
            else if (localStorage.getItem("proxy") == "sj") {
                url = "/scram/service/" + encodeURIComponent(url);
            }
    
            window.location.href = url;
        });
    }
    });