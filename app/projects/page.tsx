import type { Metadata } from "next";
import { NotebookHeading, NotebookHero, NotebookLink } from "../notebook-ui";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { AvenraLanes, ProjectIndex } from "./studio";

export const metadata: Metadata = {
  title: "Project Studio · Field Notes",
  description: "Explore Avenra AI, venture concepts, research, and tools by Ayush Kumar Sahoo.",
};

function StudioGraphic() {
  return (
    <div className="notebook-panel studio-figure">
      <p className="panel-meta"><span className="dot" /> STUDIO MAP</p>
      <svg viewBox="0 0 450 205" aria-hidden="true">
        <g fill="none" stroke="#685c81" strokeWidth="1">
          <circle cx="225" cy="101" r="63" />
          <circle cx="225" cy="101" r="86" strokeDasharray="3 7" />
          <ellipse cx="225" cy="101" rx="155" ry="42" transform="rotate(-15 225 101)" />
          <ellipse cx="225" cy="101" rx="155" ry="42" transform="rotate(15 225 101)" />
          <path d="M93 68h50l22 18m192-20h-53l-24 22M225 154v35" />
        </g>
        <circle cx="225" cy="101" r="44" fill="#26213b" stroke="#bca4eb" />
        <path d="m206 118 19-39 19 39m-30-15h22" fill="none" stroke="#d6bff7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <g fill="#d6bff7"><circle cx="93" cy="68" r="4"/><circle cx="357" cy="66" r="4"/><circle cx="225" cy="189" r="4"/></g>
        <g className="studio-svg-text" fill="#e1d4f6">
          <text x="93" y="54" textAnchor="middle">RESEARCH</text>
          <text x="357" y="52" textAnchor="middle">BUILD</text>
          <text x="243" y="193">EXPLAIN</text>
        </g>
      </svg>
    </div>
  );
}

export default function Projects() {
  return (
    <>
      <SiteHeader section="projects" />
      <main id="main">
        <NotebookHero theme="studio" eyebrow="FIELD NOTES / BUILDS & CONCEPTS" title="The project" accent="studio."
          intro="Avenra AI, product ideas, and working tools. This is where I collect what I’m building and the questions behind each project.">
          <StudioGraphic />
        </NotebookHero>
        <div className="track-nav paper">
          <nav className="wrap track-nav-inner" aria-label="Studio sections">
            <a href="#avenra"><span>01</span> Avenra AI</a>
            <a href="#project-index"><span>02</span> Project index</a>
          </nav>
        </div>
        <section id="avenra" className="notebook-section paper" aria-labelledby="avenra-title">
          <div className="wrap">
            <NotebookHeading id="avenra-title" label="01 / FEATURED INITIATIVE" title="Avenra AI" detail="An engineering initiative for exploring real problems, building focused prototypes, and sharing what the tests reveal." />
            <AvenraLanes />
            <div className="avenra-caption"><span>AVENRA MOTTO</span><p>“Vision can build anything.”</p></div>
          </div>
        </section>
        <section id="project-index" className="notebook-section paper studio-index-section" aria-labelledby="project-index-title">
          <div className="wrap">
            <NotebookHeading id="project-index-title" label="02 / WORKING INDEX" title="Other projects" detail="Browse by stage to see what’s available to try and what’s still being explored." />
            <ProjectIndex />
          </div>
        </section>
        <section className="paper notebook-band">
          <div className="wrap notebook-band-inner">
            <div><p className="eyebrow">THE LEARNING NOTEBOOK</p><h2>Follow the ideas behind the work.</h2></div>
            <NotebookLink href="/learning">Explore the learning tracks</NotebookLink>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
