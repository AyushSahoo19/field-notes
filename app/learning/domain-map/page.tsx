import type { Metadata } from "next";
import { paths } from "../career/catalog";
import { DomainAtlas } from "../career/domain-atlas";
import { DomainMapTabs } from "./domain-map-tabs";
import "../career/domain-circuit.css";

export const metadata: Metadata = {
  title: "Interactive Domain Map · Field Notes",
  description: "Explore 21 connected career domains and open the AI Stack Atlas, Avenra AI, or The Forge.",
};

export default function DomainMapPage() {
  const domains = Object.fromEntries(paths.map(({ id, title, intro, family, needs, subjects, capstone }) => [
    id, { title, intro, family, needs, subjects, capstone },
  ]));

  return (
    <>
      <div className="study-atlas-tab-band">
        <div className="study-atlas-container">
          <p className="study-atlas-kicker">LEARNING / DOMAIN MAP</p>
          <DomainMapTabs />
        </div>
      </div>
      <section id="domain-map" className="notebook-section paper career-atlas-section domain-map-section" aria-labelledby="domain-map-title">
        <div className="study-atlas-container">
          <header className="career-atlas-heading">
            <p className="eyebrow">CAREER ATLAS / DOMAIN MAP</p>
            <h1 id="domain-map-title">How the domains connect<span>.</span></h1>
            <p>Trace a route across the atlas, inspect the prerequisites for a domain, or zoom in on its topics and practice projects.</p>
          </header>
          <h2 className="study-atlas-map-label">Map views</h2>
          <DomainAtlas domains={domains} />
        </div>
      </section>
    </>
  );
}
