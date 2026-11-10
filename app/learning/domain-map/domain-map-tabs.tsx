import { domainMapSections, type StudyAtlasId } from "./study-atlases";

export function DomainMapTabs({ active = "career-domains" }: { active?: StudyAtlasId | "career-domains" }) {
  return (
    <nav className="study-atlas-tabs" aria-label="Domain Map sections">
      {domainMapSections.map(({ id, title, subtitle, href }, index) => (
        <a key={id} href={href} aria-current={active === id ? "page" : undefined}>
          <span>0{index + 1}</span><strong>{title}</strong><small>{subtitle}</small>
        </a>
      ))}
    </nav>
  );
}
