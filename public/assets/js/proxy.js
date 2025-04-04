async function init() {
    try {
        const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
        const wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";

        const transport = localStorage.getItem("transport") || "libcurl";
        const transportPath = transport === "epoxy" ? "/epoxy/index.mjs" : "/libcurl/index.mjs";

        if (await connection.getTransport() !== transportPath) {
            await connection.setTransport(transportPath, [{ wisp: wispUrl }]);
            console.log(`Using ${transport} transport. Wisp URL is: ${wispUrl}`);
        }

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('../sw.js', { scope: '/' })
            });
        }
    } catch (error) {
        console.error('Initialization failed:', error);
    }
}

init();