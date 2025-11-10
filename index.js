import express from "express";
import { createServer } from "node:http";
import Groq from "groq-sdk";
import { GoogleGenAI } from "@google/genai";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { bareModulePath } from "@mercuryworkshop/bare-as-module3"
import { join } from "node:path";
import { hostname } from "node:os";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";
// see https://github.com/xylara/venus
import venus from "./venus.bundle.js"

const __dirname = process.cwd();
const app = express();

const publicPath = join(__dirname, "public");
app.use(express.static(publicPath));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

wisp.options.dns_method = "resolve";
wisp.options.dns_servers = ["94.140.14.14", "94.140.15.15", "1.1.1.3", "1.0.0.3"];
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
    res.render("index");
});

app.get("/ask", (req, res) => {
    res.render("ask");
});

app.get("/settings", (req, res) => {
    res.render("settings/index");
});

app.get("/settings/styles", (req, res) => {
    res.render("settings/styles");
});

app.get("/settings/misc", (req, res) => {
    res.render("settings/misc");
});

app.get("/search", (req, res) => {
    res.render("search");
});

app.post("/api/ask", async (req, res) => {
    const { service, model, prompt, apiKey } = req.body;

    if (!apiKey || !prompt || !model) {
        return res.status(400).json({ error: "Missing required parameters (apiKey, prompt, or model)." });
    }

    try {
        let responseText;

        if (service === 'groq') {
            const groq = new Groq({ apiKey: apiKey });
            
            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                model: model,
            });
            responseText = completion.choices[0].message.content;

        } else if (service === 'gemini') {
            const ai = new GoogleGenAI({ apiKey: apiKey });
            
            const geminiModel = model === 'latest' ? 'gemini-2.5-flash' : model;

            const response = await ai.models.generateContent({
                model: geminiModel,
                contents: prompt,
            });
            responseText = response.text;

        } else {
            return res.status(400).json({ error: "Unsupported AI service." });
        }

        res.json({ response: responseText });
    } catch (error) {
        console.error(`${service} API Error:`, error);
        res.status(500).json({ error: `Failed to get response from ${service} API.` });
    }
});

// create the tarpit
venus(app)

server.on("request", (req, res) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "anonymous");
    app(req, res);
});

server.on("upgrade", (req, socket, head) => {
    wisp.routeRequest(req, socket, head);
});

let port = parseInt(process.env.PORT || "3000");

if (isNaN(port)) port = 3000;

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
