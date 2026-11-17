// Loads both pages in a real Chromium and measures what the user pays for:
// JavaScript downloaded, main-thread blocking, and largest contentful paint.
// Then it scrolls to the charts and opens the editor, and measures again.
//
//   npm run build
//   CHROME=/path/to/chrome npm run measure
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFile, writeFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { gzipSync } from "node:zlib";

const CHROME = process.env.CHROME;
if (!CHROME) {
  console.error("Set CHROME to a Chrome or Chromium executable.");
  process.exit(1);
}

const BASE_PATH = "/nextjs-heavy-widgets";
const PORT = 4322;
const ROOT = join(process.cwd(), "out");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

// A small static server with gzip, like GitHub Pages.
const server = createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (!path.startsWith(BASE_PATH)) throw new Error("outside base path");
    path = path.slice(BASE_PATH.length) || "/";
    let file = normalize(join(ROOT, path));
    if (!file.startsWith(ROOT)) throw new Error("bad path");
    if ((await stat(file).catch(() => null))?.isDirectory()) file = join(file, "index.html");
    let body = await readFile(file);
    const type = TYPES[extname(file)] ?? "application/octet-stream";
    const headers = { "content-type": type, "cache-control": "no-store" };
    if (/text|javascript|json|svg/.test(type) && /gzip/.test(req.headers["accept-encoding"] ?? "")) {
      body = gzipSync(body, { level: 9 });
      headers["content-encoding"] = "gzip";
    }
    res.writeHead(200, headers).end(body);
  } catch {
    res.writeHead(404).end("Not found");
  }
});
await new Promise((resolve) => server.listen(PORT, resolve));

const RUNS = [
  { label: "No throttling", rate: 1 },
  { label: "4× CPU slowdown", rate: 4 },
];
const kb = (bytes) => Math.round(bytes / 1024);

// Runs in the page before any of its scripts: records long tasks and LCP.
const OBSERVE = () => {
  window.__m = { blocking: 0, lcp: 0 };
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) window.__m.blocking += Math.max(0, e.duration - 50);
  }).observe({ type: "longtask", buffered: true });
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) window.__m.lcp = e.startTime;
  }).observe({ type: "largest-contentful-paint", buffered: true });
};

const browser = await chromium.launch({ executablePath: CHROME });
const browserVersion = browser.version();
const results = [];

for (const run of RUNS) {
  for (const mode of ["before", "after"]) {
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: run.rate });

    const scripts = new Map();
    let stage = "load";
    let jsBytes = 0;
    cdp.on("Network.requestWillBeSent", (e) => {
      if (e.type === "Script") scripts.set(e.requestId, e.request.url.split("/").pop());
    });
    cdp.on("Network.loadingFinished", (e) => {
      if (!scripts.has(e.requestId)) return;
      jsBytes += e.encodedDataLength;
      if (process.env.DETAIL && run.rate === 1) console.log(mode, stage, scripts.get(e.requestId), kb(e.encodedDataLength) + " KB");
    });

    await page.addInitScript(OBSERVE);
    await page.goto(`http://localhost:${PORT}${BASE_PATH}/${mode}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    const initialJs = jsBytes;
    const m = await page.evaluate(() => window.__m);
    if (process.env.DETAIL) console.log(mode, "charts top", await page.evaluate(() => Math.round(document.querySelector("#charts").getBoundingClientRect().top)));

    if (run.rate === 1) await page.screenshot({ path: `docs/${mode}.png` });

    stage = "scroll";
    await page.locator("#charts").scrollIntoViewIfNeeded();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);
    const afterScrollJs = jsBytes;

    stage = "edit";
    if (mode === "after") await page.getByRole("button", { name: "Edit notes" }).click();
    else await page.locator(".ProseMirror").click();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);
    const afterEditJs = jsBytes;

    results.push({
      run: run.label,
      mode,
      initialJsKb: kb(initialJs),
      afterScrollJsKb: kb(afterScrollJs),
      afterEditJsKb: kb(afterEditJs),
      blockingMs: Math.round(m.blocking),
      lcpMs: Math.round(m.lcp),
    });
    await page.close();
  }
}

await browser.close();
server.close();

await writeFile(
  "docs/results.json",
  JSON.stringify({ browser: `Chromium ${browserVersion}, headless`, date: new Date().toISOString(), results }, null, 2) + "\n",
);

console.log("| Machine | Version | JS on load | + charts | + editor | Main-thread blocking | LCP |");
console.log("| --- | --- | --- | --- | --- | --- | --- |");
for (const r of results) {
  console.log(
    `| ${r.run} | ${r.mode} | ${r.initialJsKb} KB | ${r.afterScrollJsKb} KB | ${r.afterEditJsKb} KB | ${r.blockingMs} ms | ${r.lcpMs} ms |`,
  );
}
