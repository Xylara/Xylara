var form = document.getElementById("form");
var input = document.getElementById("input");

async function init() {
    try {
        const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
        const wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
        
        if (localStorage.getItem("transport") == "epoxy") {
            if (await connection.getTransport() !== "/epoxy/index.mjs") {
                await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
            }
        } else {
            if (await connection.getTransport() !== "/libcurl/index.mjs") {
                await connection.setTransport("/libcurl/index.mjs", [{ wisp: wispUrl }]);
            }
        }
    } catch (err) {
        console.error("BareMux initialization error:", err);
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
        console.error("Scramjet initialization error:", error);
    }
}

init();

if (form && input) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        var url = input.value.trim();
        var isUrl = (val = "") => {
            return /^http(s?):\/\//.test(val) || (val.includes(".") && val.substr(0, 1) !== " ");
        };

        if (!isUrl(url)) {
            url = "https://duckduckgo.com/?t=h_&q=" + url;
        } else if (!(url.startsWith("https://") || url.startsWith("http://"))) {
            url = `https://${url}`;
        }

        if (localStorage.getItem("proxy") == "uv") {
            await uvEncode(url);
        } else if (localStorage.getItem("proxy") == "sj") {
            await sjEncode(url);
        }
    });
}

async function uvEncode(url) {
    const encodedUrl = __uv$config.prefix + __uv$config.encodeUrl(url);
    window.location.href = encodedUrl;
}

async function sjEncode(url) {
    const encodedUrl = "/scram/service/" + encodeURIComponent(url);
    window.location.href = encodedUrl;
}