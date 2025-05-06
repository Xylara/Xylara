import express from "express";
import { createServer } from "node:http";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { bareModulePath } from "@mercuryworkshop/bare-as-module3"
import { join } from "node:path";
import { hostname } from "node:os";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";

const __dirname = process.cwd();
const app = express();

const publicPath = join(__dirname, "public");
app.use(express.static(publicPath));

wisp.options.dns_method = "resolve";
wisp.options.dns_servers = ["94.140.14.14", "94.140.15.15"];
wisp.options.dns_result_order = "ipv4first";

const server = createServer();

app.use("/bare-module/", express.static(bareModulePath));
app.use("/libcurl/", express.static(libcurlPath));
app.use("/baremux/", express.static(baremuxPath, {
    extensions: ['js'],
    index: 'index.js'
}));

app.use("/epoxy/", express.static(epoxyPath, {
    extensions: ['js'],
    index: 'index.js',
    type: 'application/javascript'
}));

app.get("/baremux/index.js", (req, res) => {
    res.sendFile(join(baremuxPath, "index.js"), { headers: { 'Content-Type': 'application/javascript' } });
});

app.get("/epoxy/index.js", (req, res) => {
    res.sendFile(join(epoxyPath, "index.js"), { headers: { 'Content-Type': 'application/javascript' } });
});

app.get("/libcurl/index.js", (req, res) => {
    res.sendFile(join(libcurlPath, "index.js"), { headers: { 'Content-Type': 'application/javascript' } });
});

app.get("/", (req, res) => {
    res.sendFile(join(publicPath, "index.html"));
});

app.get("/proccy", (req, res) => {
    res.sendFile(join(publicPath, "proccy.html"));
});

app.get("/settings", (req, res) => {
    res.sendFile(join(publicPath, "settings.html"));
});

app.get("*", (req, res) => {
    res.sendFile(join(publicPath, "404.html"));
});

server.on("request", (req, res) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "anonymous");
    app(req, res);
});

server.on("upgrade", (req, socket, head) => {
    wisp.routeRequest(req, socket, head);
});

let port = parseInt(process.env.PORT || "3001");

if (isNaN(port)) port = 3001;

server.on("listening", () => {
    const address = server.address();

    // by default we are listening on 0.0.0.0 (every interface)
    // we just need to list a few
    console.log("Listening on:");
    console.log(`\thttp://localhost:${address.port}`);
    console.log(`\thttp://${hostname()}:${address.port}`);
    console.log(
        `\thttp://${address.family === "IPv6" ? `[${address.address}]` : address.address
        }:${address.port}`
    );

});

// https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close();
    process.exit(0);
}

server.listen({
    port,
});
