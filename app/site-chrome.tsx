import { sitePath } from "../lib/site-path";
import type { ReactNode } from "react";

export const github = "https://github.com/AyushSahoo19";
export const atlas = "https://ai-mastery-atlas-ayush.ayush-kumar-sahoo10.chatgpt.site";
export const precisionLab = github + "/lab-m01-reproducible-calculation-and-error-lab";
export const brandInitials = "AS";

export function Icon({ name }: { name: "arrow" | "out" | "down" | "pulse" | "pin" | "code" }) {
  const paths = {
    arrow: "M3 8h10M9 4l4 4-4 4",
    out: "M4 12l8-8M5 4h7v7",
    down: "M8 3v10m-4-4 4 4 4-4",
    pulse: "M1.5 9h3l2-5 3 9 2-5h3",
    pin: "M12.5 6.5c0 3.2-4.5 7-4.5 7s-4.5-3.8-4.5-7a4.5 4.5 0 1 1 9 0ZM8 6.5h.01",
    code: "m5.5 4-4 4 4 4m5-8 4 4-4 4",
  };
  return (
    <svg className="icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d={paths[name]} stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Brand({ home }: { home: boolean }) {
  return (
    <a className="brand" href={home ? "#top" : sitePath("/")}>
      <span className="brand-mark" aria-hidden="true">{brandInitials}</span>
      <span>Ayush Kumar Sahoo<small>FIELD NOTES</small></span>
    </a>
  );
}

export function ExternalLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return <a className={className} href={href} target="_blank" rel="noreferrer">{children}<Icon name="out" /></a>;
}


export const siteNavItems = [
  { label: "Work", href: "/#work", section: "work" },
  { label: "Learning", href: "/learning", section: "learning" },
  { label: "Projects", href: "/projects", section: "projects" },
  { label: "Frameworks", href: "/frameworks", section: "frameworks" },
  { label: "Lab", href: "/#lab", section: "lab" },
  { label: "About", href: "/#about", section: "about" },
] as const;

export function SiteHeader({ section }: { section: "home" | "learning" | "projects" | "frameworks" }) {
  const home = section === "home";
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header id="top" className="header site-header">
        <div className="wrap header-inner">
          <Brand home={home} />
          <nav aria-label="Main">
            {siteNavItems.map((item) => (
              <a key={item.href} href={home && item.href.startsWith("/#") ? item.href.slice(1) : sitePath(item.href)}
                aria-current={item.section === section ? "true" : undefined}>{item.label}</a>
            ))}
          </nav>
          <ExternalLink href={github} className="header-github">GitHub</ExternalLink>
        </div>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer paper">
      <div className="wrap footer-inner">
        <span>FIELD NOTES <b>/</b> AYUSH KUMAR SAHOO</span>
        <a href="#top">Back to top <span aria-hidden="true">↑</span></a>
      </div>
    </footer>
  );
}
