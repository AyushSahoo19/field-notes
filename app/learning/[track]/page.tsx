import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NotebookLink } from "../../notebook-ui";
import { atlas, ExternalLink, Icon } from "../../site-chrome";
import { pathContent, paths } from "../career/catalog";
import { CareerHero, CareerNav } from "../career/hero";
import { PathWorkbench } from "../career/path-workbench";
import { AttentionLab, CostLab, PilotLab } from "../track-labs";
import "../career/career.css";

type Props = { params: Promise<{ track: string }> };

export function generateStaticParams() {
  return paths.map((path) => ({ track: path.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { track } = await params;
  const path = paths.find((p) => p.id === track);
  return path ? { title: `${path.title} · Field Notes`, description: path.intro } : {};
}

export default async function TrackPage({ params }: Props) {
  const { track: id } = await params;
  const path = paths.find((p) => p.id === id);
  if (!path) notFound();
  const content = pathContent(path);
  const demo = id === "ai" ? <AttentionLab /> : id === "finance" ? <CostLab /> : id === "startups" ? <PilotLab /> : null;
  return (
    <>
      <CareerHero label={`CAREER LEARNING ATLAS / ${path.family.toUpperCase()}`} title={path.title} intro={path.intro}
        actions={<><a className="button primary" href="#study-path">Open workbench <Icon name="down" /></a>{demo && <a className="quiet-link" href="#experiment">Try the experiment <Icon name="arrow" /></a>}</>}>
        <div className="notebook-panel track-brief career-hero-panel">
          <p className="panel-meta"><span className="dot" /> PORTFOLIO TARGET</p>
          <p>{path.capstone[0]}</p>
          <p className="career-target-proof">{path.capstone[1]}</p>
          <div className="hero-ladder"><span>{path.subjects.length} core subjects</span><span>{content.readings.length} links</span></div>
        </div>
      </CareerHero>
      <CareerNav current="path" />
      <section id="study-path" className="notebook-section paper career-path-section" aria-label="Path workbench">
        <div className="wrap"><PathWorkbench path={path} content={content} /></div>
      </section>
      {demo && <section id="experiment" className={`notebook-section lab-section theme-${id}`} aria-labelledby="demo-title"><div className="wrap">{demo}</div></section>}
      <section className="paper notebook-band">
        <div className="wrap notebook-band-inner">
          <div><p className="eyebrow">CAREER LEARNING ATLAS</p><h2>Explore another path.</h2></div>
          {id === "ai" && <ExternalLink className="text-link" href={atlas}>AI Mastery Atlas <span className="link-note">Site access required</span></ExternalLink>}
          <NotebookLink href="/learning#path-catalog">Back to all paths</NotebookLink>
        </div>
      </section>
    </>
  );
}
