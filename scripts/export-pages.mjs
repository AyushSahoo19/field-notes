import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { startProdServer } from "../node_modules/vinext/dist/server/prod-server.js";

const base = process.env.NEXT_PUBLIC_PAGES_BASE;
if (base === undefined || !/^(?:\/[\w.-]+)*$/.test(base) || base.split("/").some((part) => part === "." || part === "..")) {
  throw new Error("Set NEXT_PUBLIC_PAGES_BASE to the same URL prefix used for the build.");
}

const output = "dist/pages";
await rm(output, { recursive: true, force: true });
await cp("public", output, { recursive: true });
await cp(path.join("dist/client", base, "_next"), path.join(output, "_next"), { recursive: true });

const { server, port } = await startProdServer({ port: 0, host: "127.0.0.1" });
const origin = `http://127.0.0.1:${port}`;
const atlasPrefix = "/learning/domain-map/";
const routes = new Set(["/"]);

async function writePage(route, html) {
  const directory = path.join(output, route);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "index.html"), html);
}

function collectLinks(html) {
  for (const [, href] of html.matchAll(/<a\b[^>]*\shref="(\/(?!\/)[^"]*)"/gi)) {
    const pathname = new URL(href, origin).pathname;
    if (!pathname.startsWith(base + "/")) throw new Error(`Link escapes the Pages prefix: ${href}`);
    const route = pathname.slice(base.length).replace(/\/$/, "") || "/";
    if (!/^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/.test(route)) {
      throw new Error(`Unexpected local route: ${href}`);
    }
    routes.add(route);
  }
}

try {
  for (const route of routes) {
    const response = await fetch(origin + base + route, { redirect: "manual" });
    if (!response.ok || !response.headers.get("content-type")?.includes("text/html")) {
      throw new Error(`Cannot export ${route}: HTTP ${response.status}`);
    }
    let html = await response.text();
    if (route.startsWith(atlasPrefix)) {
      const policy = response.headers.get("content-security-policy");
      if (!policy) throw new Error(`Missing script policy for ${route}`);
      // A static host can enforce script hashes through a meta policy.
      const metaPolicy = policy.split("; ").filter((rule) => !/^(sandbox|frame-ancestors)\b/.test(rule)).join("; ");
      html = html.replace("<head>", `<head><meta http-equiv="Content-Security-Policy" content="${metaPolicy}"><meta name="referrer" content="no-referrer">`);

      const target = base + route + "/";
      const legacy = atlasPrefix + "read/" + route.slice(atlasPrefix.length);
      await writePage(legacy, `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Atlas moved</title><meta http-equiv="refresh" content="0;url=${target}"></head><body><a href="${target}">Open the atlas</a></body></html>`);
    }
    collectLinks(html);
    await writePage(route, html);
  }
  const missing = await fetch(origin + base + "/page-not-found");
  if (missing.status !== 404) throw new Error("The Pages fallback must render a 404.");
  await writeFile(path.join(output, "404.html"), await missing.text());
  console.log(`Exported ${routes.size} routes to ${output}.`);
} finally {
  server.close();
}
