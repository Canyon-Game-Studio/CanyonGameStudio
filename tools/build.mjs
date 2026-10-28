// ============================================================================
// Builds the static site from src/.  Usage:  node tools/build.mjs
// Writes: index.html, pt/, <game>/, pt/<game>/, 404.html, sitemap.xml,
//         site.webmanifest and vercel.json (headers, cache, redirects).
// No dependencies: plain Node 18+.
// ============================================================================
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE, LANGS, GAMES, PRIVACY, utm } from "../src/content.mjs";
import { home, game, privacy, notFound, homePath, gamePath, privacyPath, HEAD_SCRIPT } from "../src/templates.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const now = Date.now();
const today = new Date(now).toISOString().slice(0, 10);
const demoLive = now < SITE.demoEnds;

// Cache-busting: every local asset URL gets ?v=<content hash>, so the files can
// be cached for a long time and still update the moment they change.
const hashes = new Map();
function asset(path) {
  if (!hashes.has(path)) {
    const file = join(ROOT, path);
    if (!existsSync(file)) throw new Error(`Missing asset: ${path}`);
    hashes.set(path, createHash("md5").update(readFileSync(file)).digest("hex").slice(0, 8));
  }
  return `${path}?v=${hashes.get(path)}`;
}
const ctx = { asset, demoLive, today };

function write(rel, content) {
  const file = join(ROOT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
  console.log("  wrote", rel);
}
const out = (path) => (path.endsWith("/") ? `${path.slice(1)}index.html` : path.slice(1));

// ---------- pages ----------
const urls = [];   // for the sitemap: [{ en, pt }]
for (const lang of Object.keys(LANGS)) write(out(homePath(lang)), home(ctx, lang));
urls.push({ en: homePath("en"), pt: homePath("pt") });

for (const g of GAMES) {
  for (const lang of Object.keys(LANGS)) write(out(gamePath(lang, g.slug)), game(ctx, lang, g));
  urls.push({ en: gamePath("en", g.slug), pt: gamePath("pt", g.slug) });
}
// Privacy policies: only linked from the store listings, so not in the sitemap.
for (const p of PRIVACY) write(out(privacyPath(p.slug)), privacy(ctx, p));
write("404.html", notFound(ctx));

// ---------- sitemap (with hreflang alternates) ----------
const alt = (u) => `    <xhtml:link rel="alternate" hreflang="en" href="${SITE.url}${u.en}"/>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${SITE.url}${u.pt}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE.url}${u.en}"/>`;
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.flatMap((u) => [u.en, u.pt].map((loc) => `  <url>
    <loc>${SITE.url}${loc}</loc>
    <lastmod>${today}</lastmod>
${alt(u)}
  </url>`)).join("\n")}
</urlset>
`);

// ---------- web app manifest ----------
write("site.webmanifest", JSON.stringify({
  name: SITE.name,
  short_name: "Canyon",
  start_url: "/",
  display: "browser",
  background_color: "#1A0F0C",
  theme_color: "#1A0F0C",
  icons: [
    { src: "/images/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/images/icon-512.png", sizes: "512x512", type: "image/png" },
  ],
}, null, 2) + "\n");

// ---------- vercel.json ----------
const scriptHash = createHash("sha256").update(HEAD_SCRIPT).digest("base64");
const csp = [
  "default-src 'self'",
  `script-src 'self' 'sha256-${scriptHash}'`,
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

// Short links for bios and posts: canyongamestudio.com/demo, /wishlist, /steam
const shortLinks = [
  ["/demo", demoLive ? utm(SITE.steamDemo, "shortlink", "demo") : utm(SITE.steamStore, "shortlink", "demo")],
  ["/wishlist", utm(SITE.steamStore, "shortlink", "wishlist")],
  ["/steam", utm(SITE.steamDeveloper, "shortlink", "steam")],
  ["/instagram", SITE.instagram],
];
const aliases = [
  ["/trashparty", "/trash-party/"], ["/trashcorp", "/trash-corp/"],
  // TrashBlood is one word: the page moved from /trash-blood/ on 17 Oct 2026
  ["/trash-blood", "/trashblood/"], ["/pt/trash-blood", "/pt/trashblood/"],
];
const both = (src) => [src, `${src}/`];

// Vercel Web Analytics served from our own paths: ad blockers list the default
// /_vercel/insights URLs, which would hide most PC gamers from the stats.
// Endpoints end in "/" so trailingSlash never redirects the beacons.
// Destinations must be full URLs: Vercel ignores path-only rewrites to /_vercel.
const analytics = [
  ["/cgs/a.js", "script.js"],
  ["/cgs/v/", "view"],
  ["/cgs/e/", "event"],
  ["/cgs/s/", "session"],
].map(([src, dest]) => [src, `${SITE.url}/_vercel/insights/${dest}`]);

write("vercel.json", JSON.stringify({
  cleanUrls: true,
  trailingSlash: true,
  rewrites: analytics.map(([source, destination]) => ({ source, destination })),
  redirects: [
    ...shortLinks.flatMap(([src, dest]) => both(src).map((s) => ({ source: s, destination: dest, permanent: false }))),
    ...aliases.flatMap(([src, dest]) => both(src).map((s) => ({ source: s, destination: dest, permanent: true }))),
  ],
  headers: [
    { source: "/(.*)", headers: [
      { key: "Content-Security-Policy", value: csp },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
    ] },
    { source: "/(css|js|fonts)/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    { source: "/(images|media)/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }] },
  ],
}, null, 2) + "\n");

// ---------- SEO sanity checks ----------
const warn = [];
const { T } = await import("../src/content.mjs");
for (const lang of Object.keys(LANGS)) {
  const t = T[lang];
  const checks = [[`home ${lang} title`, t.home_title, 60], [`home ${lang} desc`, demoLive ? t.home_desc_demo : t.home_desc, 160]];
  for (const g of GAMES) checks.push([`${g.slug} ${lang} title`, g[lang].title, 60], [`${g.slug} ${lang} desc`, g[lang].desc, 160]);
  for (const [label, text, max] of checks) if (text.length > max) warn.push(`${label}: ${text.length} chars (max ${max})`);
}
console.log(warn.length ? `\nSEO warnings:\n  ${warn.join("\n  ")}` : "\nSEO checks OK");
console.log(`Demo ${demoLive ? "LIVE" : "ended"} · ${hashes.size} hashed assets · built ${today}`);
