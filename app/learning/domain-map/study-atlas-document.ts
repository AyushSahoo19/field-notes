import { sitePath } from "../../../lib/site-path";
import { github, siteNavItems } from "../../site-chrome";
import { careerNavItems } from "../career/hero";
import { domainMapSections, type studyAtlas } from "./study-atlases";
import chromeStyles from "./study-atlases.css?raw";
import documentStyles from "./study-atlas-document.css?raw";
import sectionNavigation from "./study-atlas-navigation.js?raw";

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

const siteLinks = siteNavItems.map(({ href, label, section }) =>
  `<a href="${escapeHtml(sitePath(href))}"${section === "learning" ? ' aria-current="true"' : ""}>${escapeHtml(label)}</a>`).join("");
const careerLinks = careerNavItems.map(({ href, label, section }) =>
  `<a href="${escapeHtml(sitePath(href))}"${section === "map" ? ' aria-current="page"' : ""}>${escapeHtml(label)}</a>`).join("");
const pulseIcon = '<svg width="21" height="21" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M1.5 9h3l2-5 3 9 2-5h3" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export function renderStudyAtlas(html: string, atlas: NonNullable<ReturnType<typeof studyAtlas>>) {
  const tabs = domainMapSections.map(({ id, href, title, subtitle }, index) =>
    `<a href="${escapeHtml(sitePath(href))}"${id === atlas.id ? ' aria-current="page"' : ""}><span>0${index + 1}</span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(subtitle)}</small></a>`).join("");
  const jumps = atlas.sections.map(([anchor, label]) =>
    `<a href="#${escapeHtml(anchor)}">${escapeHtml(label)}</a>`).join("");

  const chrome = `
<a class="field-notes-skip" href="#field-notes-atlas-content">Skip to atlas</a>
<header id="field-notes-top" class="field-notes-header">
  <div class="field-notes-wrap field-notes-header-inner">
    <a class="field-notes-brand" href="${escapeHtml(sitePath("/"))}">
      <span class="field-notes-brand-mark">${pulseIcon}</span>
      <span>Ayush Kumar Sahoo<small>FIELD NOTES</small></span>
    </a>
    <nav aria-label="Main">${siteLinks}</nav>
    <a class="field-notes-github" href="${escapeHtml(github)}">GitHub</a>
  </div>
</header>
<div class="field-notes-atlas-chrome">
  <div class="field-notes-career-bar">
    <nav class="field-notes-wrap field-notes-career-nav" aria-label="Career atlas navigation">${careerLinks}</nav>
  </div>
  <div class="study-atlas-tab-band">
    <div class="study-atlas-container">
      <p class="study-atlas-kicker">LEARNING / DOMAIN MAP</p>
      <nav id="field-notes-atlas-tabs" class="study-atlas-tabs" aria-label="Domain Map sections">${tabs}</nav>
    </div>
  </div>
  <nav class="study-atlas-container field-notes-jumps" aria-label="Jump within ${escapeHtml(atlas.title)}"><span>Jump to</span>${jumps}</nav>
</div>
<div id="field-notes-atlas-content" tabindex="-1"></div>
`;

  const end = `
<div class="field-notes-end">
  <div class="field-notes-wrap field-notes-end-inner"><span>FIELD NOTES / AYUSH KUMAR SAHOO</span><a href="#field-notes-atlas-tabs">Back to Domain Map tabs <span aria-hidden="true">↑</span></a></div>
</div>
`;

  const description = html.includes('<meta name="description"') ? "" : `<meta name="description" content="${escapeHtml(atlas.description)}">
`;
  return html
    .replace("<html ", () => `<html data-study-atlas="${atlas.id}" `)
    .replace("</title>", " · Field Notes</title>")
    .replace("</head>", () => `${description}<style>${chromeStyles}\n${documentStyles}</style></head>`)
    .replace("<body>", () => `<body>${chrome}`)
    .replace("</body>", () => `${end}<script>${sectionNavigation}</script></body>`);
}
