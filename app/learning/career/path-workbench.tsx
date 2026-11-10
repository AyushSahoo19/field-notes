"use client";

import { useState } from "react";
import type { CareerPath, pathContent } from "./catalog";
import { DataTable, matches, MilestoneMap, PanelHeading, ResourceShelf, SearchField, useChecklist, Workbench } from "./workbench";

const tabs = ["Overview", "Syllabus", "Roadmap", "Resources", "Projects"];
const stages = ["Foundations", "Implementation", "Advanced practice", "Capstone"];

export function PathWorkbench({ path, content }: { path: CareerPath; content: ReturnType<typeof pathContent> }) {
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState(0);
  const { checked, toggle } = useChecklist(`field-notes-path-${path.id}-v1`);
  const total = path.subjects.length + 1;
  const completed = checked.filter((id) => id === "capstone" || path.subjects.some((s) => s[0] === id)).length;
  const quant = content.quant;
  const syllabus = path.subjects.filter((s) => matches(query, s));
  const lessons = content.lessons.filter((r) => matches(query, [r.title, r.week, r.practice, r.course]));
  const subjects = content.subjects.filter((r) => matches(query, [r.title, ...r.concepts]));
  const phases = quant?.phases.filter((r) => matches(query, [r.title, ...r.topics])) ?? [];
  const orderedStages = path.subjects.length === 4 ? ["Foundations", "Core methods", "Advanced practice", "Applied methods", "Capstone"] : stages;

  function focusSubject(subject: string) {
    setQuery(subject);
    setTab(1);
  }

  return (
    <Workbench title={`${path.title} sections`} tabs={tabs} active={tab} onChange={(index) => { setQuery(""); setTab(index); }}>
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
        <PanelHeading label="02 / SYLLABUS" title="Topics, subtopics & practice" detail="Search the core curriculum and any linked subjects or lessons from your source collection." />
        <SearchField label="Search the syllabus" value={query} onChange={setQuery} placeholder="Search a subject, topic, or exercise" autoFocus={Boolean(query)} />
        <DataTable label="Core syllabus" columns={["Subject", "Topics and subtopics", "Practice task"]} rows={syllabus} />
        {subjects.length > 0 && <><h3 className="career-subheading">Subjects from your knowledge map</h3><DataTable label="Mapped subjects" columns={["Subject", "Concepts"]} rows={subjects.map((r) => [r.title, r.concepts.join(" · ")])} /></>}
        {lessons.length > 0 && <><h3 className="career-subheading">Engineering Mastery lessons</h3><DataTable label="Workbook lessons" columns={["Lesson", "Week", "Exercise", "Prerequisite", "Course"]} rows={lessons.map((r) => [r.title, r.week, r.practice, r.prerequisite, r.course])} /></>}
        {phases.length > 0 && <><h3 className="career-subheading">Quant curriculum · phase details</h3><DataTable label="Full quant syllabus" columns={["Phase", "Source pace", "Topics"]} rows={phases.map((r) => [r.title, r.tempo, <ul key="topics" className="table-topic-list">{r.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>])} /></>}
      </>}
      {tab === 2 && <>
        <PanelHeading label="03 / ROADMAP" title="Build skill in stages" detail="Mark a stage complete when you can show its practice result. Progress is saved in this browser." />
        <MilestoneMap stages={orderedStages} active={stage} onSelect={setStage} />
        <div className="career-callout">
          <p className="eyebrow">{orderedStages[stage].toUpperCase()}</p>
          <h3>{path.subjects[stage]?.[0] ?? path.capstone[0]}</h3><p>{path.subjects[stage]?.[2] ?? path.capstone[1]}</p>
        </div>
        <div className="career-progress"><span aria-live="polite">{completed} of {total} checkpoints complete</span><progress value={completed} max={total} aria-label="Path progress" /></div>
        <div className="career-checklist">
          {[...path.subjects.map((s) => [s[0], s[0]]), ["capstone", path.capstone[0]]].map(([id, label]) => <label key={id}><input type="checkbox" checked={checked.includes(id)} onChange={() => toggle(id)} /> {label}</label>)}
        </div>
        {content.weeks.length > 0 && <><h3 className="career-subheading">Linked workbook weeks</h3><DataTable label="Related engineering roadmap weeks" columns={["Week", "Module", "Deliverable", "Open-source mission"]} rows={content.weeks.map((r) => [<a key="week" href={`/learning/master-roadmap?week=${r.week}#master-plan`}>Week {r.week}</a>, r.title, r.output, r.mission])} /></>}
        {quant && <><h3 className="career-subheading">19-phase quant sequence</h3><DataTable label="Quant roadmap" columns={["Phase", "Pace from source", "Starting topics"]} rows={quant.phases.map((r) => [r.title, r.tempo, r.topics.slice(0, 3).join(" · ")])} /></>}
      </>}
      {tab === 3 && <>
        <PanelHeading label="04 / READING SHELF" title="Courses, books, papers & code" detail="Use the filters to find a first reference, an original paper, or a repository to inspect." />
        <ResourceShelf readings={content.readings} />
        {quant && <>
          <h3 className="career-subheading">Quant master book stack</h3>
          <DataTable label="Quant source book stack" columns={["Domain", "Primary reading", "Reference reading"]} rows={quant.books.map((r) => r.map((c) => c.text))} />
          <h3 className="career-subheading">Research topics from the quant curriculum</h3>
          <DataTable label="Quant paper topics" columns={["Research area", "Reading list"]} rows={quant.reading.map((r) => [r.title, r.topics.join(" · ")])} />
          <h3 className="career-subheading">Quant open-source track</h3>
          <DataTable label="Quant repositories" columns={["Repository", "Why follow it", "Contribution path"]} rows={quant.repos.map((r) => r.map((c) => c.url ? <a key={c.url} href={c.url} target="_blank" rel="noreferrer">{c.text}</a> : c.text))} />
        </>}
      </>}
      {tab === 4 && <>
        <PanelHeading label="05 / BUILD & VERIFY" title="Portfolio projects" detail="Use the evidence criteria to decide whether a project is ready to show." />
        <div className="career-callout"><p className="eyebrow">CAPSTONE</p><h3>{path.capstone[0]}</h3><p>{path.capstone[1]}</p></div>
        <DataTable label="Practice projects" columns={["Build", "Scope", "Evidence to collect"]} rows={path.subjects.map(([title, topics, proof]) => [title, topics, proof])} />
        {content.projects.length > 0 && <><h3 className="career-subheading">Challenges from the workbook</h3><DataTable label="Workbook projects" columns={["Challenge", "Problem", "Stack", "Acceptance evidence"]} rows={content.projects.map((r) => [r.title, r.problem, r.stack, r.criteria])} /></>}
        {quant && <><h3 className="career-subheading">Quant project ladder</h3><DataTable label="Quant project ladder" columns={["Order", "Project", "What to build", "Capability"]} rows={quant.projects.map((r) => r.map((c) => c.text))} /><h3 className="career-subheading">Interview practice matrix</h3><DataTable label="Quant interview practice" columns={["Area", "What to prepare", "How to practice"]} rows={quant.interviews.map((r) => r.map((c) => c.text))} /></>}
      </>}
    </Workbench>
  );
}
