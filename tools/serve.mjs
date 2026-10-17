// ============================================================================
// Local preview that behaves like Vercel (clean URLs, trailing slash, the
// headers and redirects from vercel.json).  Usage:  node tools/serve.mjs [port]
// Then open http://localhost:8080  (pages use root paths like /css/..., so
// opening index.html straight from disk will not load the styles).
// ============================================================================
import http from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { dirname, join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.argv[2] || 8080);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2",
  ".mp4": "video/mp4", ".xml": "application/xml", ".txt": "text/plain", ".webmanifest": "application/manifest+json",
};
const toRe = (src) => new RegExp("^" + src.replace(/\(\.\*\)/g, "(.*)") + "$");

http.createServer((req, res) => {
  const cfg = JSON.parse(readFileSync(join(ROOT, "vercel.json"), "utf8"));   // re-read: picks up rebuilds
  const p = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  const redirect = cfg.redirects.find((r) => r.source === p);
  if (redirect) { res.writeHead(redirect.permanent ? 308 : 307, { Location: redirect.destination }); return res.end(); }
  if (!extname(p) && !p.endsWith("/")) { res.writeHead(308, { Location: p + "/" }); return res.end(); }

  for (const h of cfg.headers) if (toRe(h.source).test(p)) h.headers.forEach(({ key, value }) => res.setHeader(key, value));
  let file = normalize(join(ROOT, p.endsWith("/") ? p + "index.html" : p));
  let status = 200;
  if (!file.startsWith(ROOT) || !existsSync(file) || statSync(file).isDirectory()) { file = join(ROOT, "404.html"); status = 404; }
  res.writeHead(status, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
}).listen(PORT, () => console.log(`Preview: http://localhost:${PORT}  (Ctrl+C to stop)`));
