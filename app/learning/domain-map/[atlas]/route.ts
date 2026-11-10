/// <reference types="vite/client" />

import { renderStudyAtlas } from "../study-atlas-document";
import { studyAtlas, type StudyAtlasId } from "../study-atlases";

const documents = {
  "ai-stack-atlas": () => import("../documents/ai-stack-atlas.html?raw"),
  "avenra-ai": () => import("../documents/avenra-ai.html?raw"),
  "the-forge": () => import("../documents/the-forge.html?raw"),
} satisfies Record<StudyAtlasId, () => Promise<{ default: string }>>;

async function scriptSources(html: string) {
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  const hashes = await Promise.all(scripts.map(async ([, script]) => {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(script));
    return "'sha256-" + btoa(String.fromCharCode(...new Uint8Array(digest))) + "'";
  }));
  return hashes.join(" ");
}

export async function GET(_request: Request, { params }: { params: Promise<{ atlas: string }> }) {
  const atlas = studyAtlas((await params).atlas);
  if (!atlas) return new Response("Atlas not found", { status: 404 });

  const { default: html } = await documents[atlas.id]();
  const page = renderStudyAtlas(html, atlas);
  return new Response(page, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy": [
        "default-src 'none'",
        "sandbox allow-scripts allow-same-origin allow-top-navigation-by-user-activation",
        `script-src ${await scriptSources(page)}`,
        "style-src 'unsafe-inline' https://fonts.googleapis.com",
        "font-src https://fonts.gstatic.com",
        "base-uri 'none'",
        "form-action 'none'",
        "frame-ancestors 'self'",
      ].join("; "),
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
