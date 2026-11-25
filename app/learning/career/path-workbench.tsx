"use client";

import { sitePath } from "../../../lib/site-path";
import { useState } from "react";
import type { CareerPath, pathContent } from "./catalog";
import { PathResources, PathRoadmap, PathSyllabus, QuantPhaseRoadmap } from "./path-study-panels";
import { DataTable, matches, PanelHeading, SearchField, useChecklist, Workbench } from "./workbench";

const tabs = ["Overview", "Syllabus", "Roadmap", "Resources", "Projects"];

export function PathWorkbench({ path, content }: { path: CareerPath; content: ReturnType<typeof pathContent> }) {
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState("");
  const [resourceWeek, setResourceWeek] = useState<number | null>(null);
  const { checked, toggle } = useChecklist(`field-notes-path-${path.id}-v1`);
  const modules = content.plan.map((week, index) => ({
    week,
    number: index + 1,
    subject: path.subjects[index]?.[0] ?? path.capstone[0],
    checkpoint: path.subjects[index]?.[0] ?? "capstone",
  }));
  const quant = content.quant;
  const lessons = content.lessons.filter((r) => matches(query, [r.title, r.week, r.practice, r.course]));
  const subjects = content.subjects.filter((r) => matches(query, [r.title, ...r.concepts]));
  const phases = quant?.phases.filter((r) => matches(query, [r.title, ...r.topics])) ?? [];

  function focusSubject(subject: string) {
    setQuery(subject);
    setTab(1);
  }

  function openResources(week: number) {
    setResourceWeek(week);
    setTab(3);
  }

  return (
    <Workbench id={`path-workbench-${path.id}`} title={`${path.title} sections`} tabs={tabs} active={tab} onChange={(index) => {
      if (index === tab) return;
      setQuery("");
      setResourceWeek(null);
      setTab(index);
    }}>
      {tab === 0 && <>
        <PanelHeading label="01 / ORIENTATION" title="Start with the subject map" detail="Select a subject to see its topics and a concrete practice task." />
        <div className="career-overview-grid">
          <div><h3>Target roles</h3><ul className="topic-tags">{path.roles.map((role) => <li key={role}>{role}</li>)}</ul></div>
          <div><h3>Start here</h3><ul className="topic-tags">{path.needs.map((need) => <li key={need}>{need}</li>)}</ul></div>
        </div>
        <div className="subject-map" role="group" aria-label="Explore core subjects">
          {path.subjects.map(([title, topics], i) => <button type="button" key={title} onClick={() => focusSubject(title)}><span>{String(i + 1).padStart(2, "0")}</span><strong>{title}</strong><small>{topics}</small></button>)}
        </div>
        <div className="career-callout"><p className="eyebrow">PORTFOLIO TARGET</p><h3>{path.capstone[0]}</h3><p>{path.capstone[1]}</p></div>
      </>}
      {tab === 1 && <>
        <PanelHeading label="02 / SYLLABUS" title="Topics, subtopics & practice" detail="Use each module’s topic groups and tools to prepare for its weekly practice." />
        <SearchField label="Search the syllabus" value={query} onChange={setQuery} placeholder="Search a subject, topic, or exercise" autoFocus={Boolean(query)} />
        <PathSyllabus modules={modules} query={query} openResources={openResources} />
        {subjects.length > 0 && <><h3 className="career-subheading">Subjects from your knowledge map</h3><DataTable label="Mapped subjects" columns={["Subject", "Concepts"]} rows={subjects.map((r) => [r.title, r.concepts.join(" · ")])} /></>}
        {lessons.length > 0 && <><h3 className="career-subheading">Engineering Mastery lessons</h3><DataTable label="Workbook lessons" columns={["Lesson", "Week", "Exercise", "Prerequisite", "Course"]} rows={lessons.map((r) => [r.title, r.week, r.practice, r.prerequisite, r.course])} /></>}
        {phases.length > 0 && <><h3 className="career-subheading">Quant curriculum · phase details</h3><DataTable label="Full quant syllabus" columns={["Phase", "Source pace", "Topics"]} rows={phases.map((r) => [r.title, r.tempo, <ul key="topics" className="table-topic-list">{r.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>])} /></>}
      </>}
      {tab === 2 && <>
        <PanelHeading label="03 / ROADMAP" title="Weekly study plan" detail="Work through each week’s references and practice, then check off the result. Progress is saved in this browser." />
        <PathRoadmap modules={modules} checked={checked} toggle={toggle} openResources={openResources} />
        {content.weeks.length > 0 && <><h3 className="career-subheading">Linked workbook weeks</h3><DataTable label="Related engineering roadmap weeks" columns={["Week", "Module", "Deliverable", "Open-source mission"]} rows={content.weeks.map((r) => [<a key="week" href={sitePath(`/learning/master-roadmap?week=${r.week}#master-plan`)}>Week {r.week}</a>, r.title, r.output, r.mission])} /></>}
        {quant && <QuantPhaseRoadmap phases={quant.phases} />}
      </>}
      {tab === 3 && <>
        <PanelHeading label="04 / READING SHELF" title="Resources in study order" detail="Work through the numbered references in each week. Use supplemental references for deeper study." />
        <PathResources modules={modules} supplemental={content.supplemental} initialWeek={resourceWeek} />
      </>}
      {tab === 4 && <>
        <PanelHeading label="05 / BUILD & VERIFY" title="Portfolio projects" detail="Use the evidence criteria to decide whether a project is ready to show." />
        {quant && <details className="study-card study-phase">
          <summary>Quant research bibliography and project topics</summary>
          <h3 className="career-subheading">Books from the source curriculum</h3>
          <DataTable label="Quant source book stack" columns={["Domain", "Primary reading", "Reference reading"]} rows={quant.books.map((r) => r.map((c) => c.text))} />
          <h3 className="career-subheading">Research topics from the quant curriculum</h3>
          <DataTable label="Quant paper topics" columns={["Research area", "Topics to investigate"]} rows={quant.reading.map((r) => [r.title, r.topics.join(" · ")])} />
        </details>}
        <div className="career-callout"><p className="eyebrow">CAPSTONE</p><h3>{path.capstone[0]}</h3><p>{path.capstone[1]}</p></div>
        <DataTable label="Practice projects" columns={["Build", "Scope", "Evidence to collect"]} rows={path.subjects.map(([title, topics, proof]) => [title, topics, proof])} />
        {content.projects.length > 0 && <><h3 className="career-subheading">Challenges from the workbook</h3><DataTable label="Workbook projects" columns={["Challenge", "Problem", "Stack", "Acceptance evidence"]} rows={content.projects.map((r) => [r.title, r.problem, r.stack, r.criteria])} /></>}
        {quant && <><h3 className="career-subheading">Quant project ladder</h3><DataTable label="Quant project ladder" columns={["Order", "Project", "What to build", "Capability"]} rows={quant.projects.map((r) => r.map((c) => c.text))} /><h3 className="career-subheading">Interview practice matrix</h3><DataTable label="Quant interview practice" columns={["Area", "What to prepare", "How to practice"]} rows={quant.interviews.map((r) => r.map((c) => c.text))} /></>}
      </>}
    </Workbench>
  );
}
