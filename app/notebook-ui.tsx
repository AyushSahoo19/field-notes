import type { ReactNode } from "react";
import { Icon } from "./site-chrome";

export function NotebookHero({ eyebrow, title, accent, intro, children, theme = "ai" }: {
  eyebrow: string;
  title: string;
  accent: string;
  intro: string;
  children: ReactNode;
  theme?: "ai" | "finance" | "startups" | "studio";
}) {
  return (
    <section className={`chapter-hero theme-${theme}`} aria-labelledby="chapter-title">
      <div className="wrap chapter-hero-grid">
        <div className="chapter-intro">
          <p className="eyebrow"><span className="eyebrow-rule" /> {eyebrow}</p>
          <h1 id="chapter-title">{title}<br /><em>{accent}</em></h1>
          <p className="chapter-description">{intro}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

export function NotebookHeading({ id, label, title, detail }: { id: string; label: string; title: string; detail?: string }) {
  return (
    <div className="section-heading notebook-heading">
      <div>
        <p className="eyebrow">{label}</p>
        <h2 id={id}>{title}<span className="period">.</span></h2>
      </div>
      {detail && <p>{detail}</p>}
    </div>
  );
}

export function NotebookLink({ href, children }: { href: string; children: ReactNode }) {
  return <a className="text-link notebook-link" href={href}>{children}<Icon name="arrow" /></a>;
}
