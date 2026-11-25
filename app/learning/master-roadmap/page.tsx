import { sitePath } from "../../../lib/site-path";
import type { Metadata } from "next";
import { Icon } from "../../site-chrome";
import { curriculum, workbookStudyResources } from "../career/catalog";
import { CareerHero, CareerNav } from "../career/hero";
import { MasterWorkbench } from "../career/master-workbench";
import "../career/career.css";

export const metadata: Metadata = {
  title: "26-Week Engineering Mastery Plan · Field Notes",
  description: "Explore the weekly roadmap, syllabus, skill matrix, project catalog, and resources from the Engineering Mastery workbook.",
};

export default async function MasterRoadmap({ searchParams }: { searchParams: Promise<{ week?: string }> }) {
  const { week } = await searchParams;
  const { weeks, lessons, projects, skills, oss, milestones } = curriculum;
  return (
    <>
      <CareerNav current="master" />
      <CareerHero label="CAREER LEARNING ATLAS / WORKBOOK EXPLORER" title="26-Week Engineering Mastery"
        intro="The workbook sequence from programming and algorithms to operating systems, databases, distributed systems, and AI. Explore the source lessons, projects, and open-source missions."
        actions={<><a className="button primary" href="#master-plan">Browse the plan <Icon name="down" /></a><a className="quiet-link" href={sitePath("/learning#path-catalog")}>All career paths <Icon name="arrow" /></a></>}>
        <div className="notebook-panel career-hero-panel">
          <p className="panel-meta"><span className="dot" /> SOURCE WORKBOOK</p>
          <div className="career-stat-grid">
            <div><strong>{weeks.length}</strong><span>Weeks</span></div><div><strong>{lessons.length}</strong><span>Lessons</span></div>
            <div><strong>{skills.length}</strong><span>Skills</span></div><div><strong>{projects.length}</strong><span>Projects</span></div>
          </div>
        </div>
      </CareerHero>
      <section id="master-plan" className="notebook-section paper career-path-section" aria-label="Workbook explorer">
        <div className="wrap"><MasterWorkbench initialWeek={Number(week) || 1} data={{ weeks, lessons, projects, skills, oss, milestones }} references={workbookStudyResources()} /></div>
      </section>
    </>
  );
}
