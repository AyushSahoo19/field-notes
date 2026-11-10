import type { ReactNode } from "react";

export function CareerHero({ label, title, intro, children, actions }: { label: string; title: string; intro: string; children: ReactNode; actions: ReactNode }) {
  return (
    <section className="chapter-hero career-hero theme-ai" aria-labelledby="career-title">
      <div className="wrap chapter-hero-grid">
        <div className="chapter-intro">
          <p className="eyebrow"><span className="eyebrow-rule"/> {label}</p>
          <h1 id="career-title">{title}<em>.</em></h1>
          <p className="chapter-description">{intro}</p>
          <div className="hero-actions career-hero-actions">{actions}</div>
        </div>
        {children}
      </div>
    </section>
  );
}

export const careerNavItems = [
  { label: "All paths", href: "/learning", section: "paths" },
  { label: "Domain map", href: "/learning/domain-map", section: "map" },
  { label: "Role matrix", href: "/learning/role-matrix", section: "roles" },
  { label: "26-week plan", href: "/learning/master-roadmap", section: "master" },
] as const;

export function CareerNav({ current }: { current: "paths" | "map" | "roles" | "path" | "master" }) {
  return (
    <div className="track-nav paper">
      <nav className="wrap track-nav-inner career-atlas-nav" aria-label="Career atlas navigation">
        {careerNavItems.map((item) => (
          <a key={item.href} href={item.href} aria-current={item.section === current ? "page" : undefined}>{item.label}</a>
        ))}
        {current === "path" && <a href="#study-path">Path workbench</a>}
      </nav>
    </div>
  );
}
