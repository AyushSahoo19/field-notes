"use client";

import { Fragment, useState, useSyncExternalStore } from "react";
import type { curriculum, Reading } from "./catalog";
import { CountFilters, DataTable, matches, MilestoneMap, PanelHeading, ResourceShelf, SearchField, useChecklist, Workbench } from "./workbench";

type Curriculum = typeof curriculum;
const tabs = ["26-week roadmap", "Lesson syllabus", "Skill matrix", "Resource library", "Project catalog", "Open source"];

function subscribeToLocation(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

function weekFromLocation() {
  return Number(new URLSearchParams(window.location.search).get("week")) || undefined;
}

export function MasterWorkbench({ data, initialWeek }: { data: Omit<Curriculum, "quant" | "subjects">; initialWeek: number }) {
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState("");
  const [skillDomain, setSkillDomain] = useState("");
  const phases = [...new Set(data.weeks.map((w) => w.phase))];
  const linkedWeek = useSyncExternalStore(subscribeToLocation, weekFromLocation, () => initialWeek) ?? initialWeek;
  const [selectedPhase, setPhase] = useState<number>();
  const phase = selectedPhase ?? Math.max(0, phases.indexOf(data.weeks.find((w) => w.week === linkedWeek)?.phase ?? ""));
  const { checked, toggle } = useChecklist("field-notes-workbook-weeks-v1");
  const weeks = data.weeks.filter((w) => w.phase === phases[phase]);
  const count = data.weeks.filter((w) => checked.includes(String(w.week))).length;
  const resources: Reading[] = data.resources.map((r) => [r.kind, r.title, r.url, `${r.domain} · ${r.detail}`]);
  const search = (label: string) => <SearchField label={label} value={query} onChange={setQuery} />;

  return (
    <Workbench title="Engineering Mastery workbook sections" tabs={tabs} active={tab} onChange={(index) => { setQuery(""); setTab(index); }}>
      {tab === 0 && <>
        <PanelHeading label="01 / MASTER ROADMAP" title="The 26-week plan" detail="Select a phase to see its weekly builds. This is a reference plan from your workbook, with progress you can track in this browser." />
        <MilestoneMap stages={phases} active={phase} onSelect={setPhase} />
        <div className="career-progress"><span aria-live="polite">{count} of {data.weeks.length} weeks complete</span><progress aria-label="Engineering roadmap progress" value={count} max={data.weeks.length} /></div>
        <DataTable label="Engineering Mastery weekly roadmap" columns={["Week", "Module and topics", "Hands-on work", "Deliverable", "Done"]} rows={weeks.map((w) => [
          <span key="week" className={w.week === linkedWeek ? "highlight-week" : undefined}>Week {w.week}</span>,
          <Fragment key="module"><strong>{w.title}</strong><p>{w.topics.join(" · ")}</p></Fragment>,
          w.practice, w.output,
          <input key="done" type="checkbox" aria-label={`Mark week ${w.week} complete`} checked={checked.includes(String(w.week))} onChange={() => toggle(String(w.week))} />,
        ])} />
        <h3 className="career-subheading">Release milestones</h3>
        <DataTable label="Workbook milestones" columns={["Milestone", "Week", "Project ID", "Definition of done"]} rows={data.milestones.map((m) => [m.title, m.week, m.project, m.evidence])} />
      </>}
      {tab === 1 && <>
        <PanelHeading label="02 / WORKBOOK SYLLABUS" title="All workbook lessons" detail="Search by topic, week, course, or exercise." />
        {search("Filter lessons")}
        <DataTable label="Engineering Mastery lessons" columns={["Lesson", "Week", "Exercise", "Prerequisite", "Course"]} rows={data.lessons.filter((r) => matches(query, [r.title, r.week, r.practice, r.course, r.prerequisite])).map((r) => [r.title, r.week, r.practice, r.prerequisite, r.course])} />
      </>}
      {tab === 2 && <>
        <PanelHeading label="03 / SKILL MATRIX" title="Foundational skills" detail="Find the subject and first study week for each skill in your workbook." />
        <CountFilters label="Skills by domain" values={data.skills.map((skill) => skill.domain)} selected={skillDomain} onSelect={setSkillDomain} />
        {search("Filter skills")}
        <DataTable label="Workbook skills" columns={["Skill", "Topic", "Domain", "First week"]} rows={data.skills.filter((r) => (!skillDomain || r.domain === skillDomain) && matches(query, [r.title, r.topic, r.domain, r.week])).map((r) => [r.title, r.topic, r.domain, r.week])} />
      </>}
      {tab === 3 && <>
        <PanelHeading label="04 / RESOURCE LIBRARY" title="Workbook readings and links" detail="Course, paper, book, and repository references carried over from the workbook. A title without a link had no URL in the source." />
        <ResourceShelf readings={resources} />
      </>}
      {tab === 4 && <>
        <PanelHeading label="05 / PROJECT CATALOG" title="Build challenges" detail="These are proposed practice projects from the workbook. Each lists its scope and acceptance criteria." />
        {search("Filter projects")}
        <DataTable label="Workbook project catalog" columns={["Project", "Domain and level", "Target week", "Architecture", "Acceptance criteria"]} rows={data.projects.filter((r) => matches(query, [r.title, r.domain, r.level, r.stack, r.architecture, r.week])).map((r) => [r.title, `${r.domain} · ${r.level}`, r.week, r.architecture, r.criteria])} />
      </>}
      {tab === 5 && <>
        <PanelHeading label="06 / CONTRIBUTIONS" title="Weekly open-source missions" detail="Use the required validation column to collect proof before recording a contribution." />
        {search("Filter missions")}
        <DataTable label="Open-source missions" columns={["Repository", "Week", "Mission", "Validation"]} rows={data.oss.filter((r) => matches(query, [r.repo, r.mission, r.validation, r.week])).map((r) => [
          r.url ? <a href={r.url} target="_blank" rel="noreferrer">{r.repo}</a> : r.repo, r.week, r.mission, r.validation,
        ])} />
      </>}
    </Workbench>
  );
}
