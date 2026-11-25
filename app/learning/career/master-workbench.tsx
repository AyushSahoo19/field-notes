"use client";

import { useState, useSyncExternalStore } from "react";
import type { curriculum, workbookStudyResources } from "./catalog";
import { StudyResourceCard } from "./path-study-panels";
import { CountFilters, DataTable, matches, MilestoneMap, PanelHeading, SearchField, useChecklist, Workbench } from "./workbench";

type Curriculum = typeof curriculum;
const tabs = ["26-week roadmap", "Lesson syllabus", "Skill matrix", "Resource library", "Project catalog", "Open source"];

function subscribeToLocation(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

function weekFromLocation() {
  return Number(new URLSearchParams(window.location.search).get("week")) || undefined;
}

export function MasterWorkbench({ data, initialWeek, references }: {
  data: Omit<Curriculum, "quant" | "subjects" | "resources">;
  initialWeek: number;
  references: ReturnType<typeof workbookStudyResources>;
}) {
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState("");
  const [skillDomain, setSkillDomain] = useState("");
  const [referenceWeek, setReferenceWeek] = useState<number>();
  const phases = [...new Set(data.weeks.map((w) => w.phase))];
  const linkedWeek = useSyncExternalStore(subscribeToLocation, weekFromLocation, () => initialWeek) ?? initialWeek;
  const [selectedPhase, setPhase] = useState<number>();
  const phase = selectedPhase ?? Math.max(0, phases.indexOf(data.weeks.find((w) => w.week === linkedWeek)?.phase ?? ""));
  const { checked, toggle } = useChecklist("field-notes-workbook-weeks-v1");
  const weeks = data.weeks.filter((w) => w.phase === phases[phase]);
  const count = data.weeks.filter((w) => checked.includes(String(w.week))).length;
  const lessons = data.lessons.filter((lesson) => matches(query, [lesson.title, lesson.week, lesson.goal, lesson.practice, lesson.course, lesson.prerequisite]));
  const library = referenceWeek ? references.byWeek[referenceWeek - 1] : [...references.assigned, ...references.supplemental];
  const resources = library.filter((resource) => matches(query, [
    resource.kind, resource.title, resource.coverage, resource.why, resource.activity, ...resource.concepts, ...resource.tools,
  ]));
  const search = (label: string) => <SearchField label={label} value={query} onChange={setQuery} />;

  function openReferences(week: number) {
    setQuery("");
    setReferenceWeek(week);
    setTab(3);
  }

  return (
    <Workbench id="master-workbench" title="Engineering Mastery workbook sections" tabs={tabs} active={tab} onChange={(index) => { setQuery(""); setReferenceWeek(undefined); setTab(index); }}>
      {tab === 0 && <>
        <PanelHeading label="01 / MASTER ROADMAP" title="The 26-week plan" detail="Select a phase to see its weekly builds. This is a reference plan from your workbook, with progress you can track in this browser." />
        <MilestoneMap stages={phases} active={phase} onSelect={setPhase} />
        <div className="career-progress"><span aria-live="polite">{count} of {data.weeks.length} weeks complete</span><progress aria-label="Engineering roadmap progress" value={count} max={data.weeks.length} /></div>
        <ol className="study-sequence" role="list" aria-label="Engineering Mastery weekly roadmap">
          {weeks.map((week) => (
            <li className="study-card" key={week.week} value={week.week}>
              <header>
                <p className={week.week === linkedWeek ? "study-meta highlight-week" : "study-meta"}>Week {week.week} · {week.hours} hours</p>
                <h3>{week.title}</h3>
              </header>
              <div className="study-assignment">
                <div>
                  <h4>Topics and subtopics</h4>
                  <ul className="study-reference-list">{week.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
                  <p className="study-practice"><strong>Course sections</strong>{week.course}</p>
                </div>
                <div>
                  <h4>Study in this order</h4>
                  <ol className="study-reference-list">{references.byWeek[week.week - 1].map((resource) => (
                    <li key={resource.url}><a href={resource.url} target="_blank" rel="noreferrer">{resource.title} <span aria-hidden="true">↗</span></a></li>
                  ))}</ol>
                  <button className="study-link" type="button" onClick={() => openReferences(week.week)}>See resources for week {week.week} <span aria-hidden="true">→</span></button>
                </div>
              </div>
              <p className="study-practice"><strong>Practice</strong>{week.practice}</p>
              <p className="study-practice"><strong>Deliverable</strong>{week.output}</p>
              <label className="study-complete"><input type="checkbox" checked={checked.includes(String(week.week))} onChange={() => toggle(String(week.week))} /> Mark week {week.week} complete</label>
            </li>
          ))}
        </ol>
        <h3 className="career-subheading">Release milestones</h3>
        <DataTable label="Workbook milestones" columns={["Milestone", "Week", "Project ID", "Definition of done"]} rows={data.milestones.map((m) => [m.title, m.week, m.project, m.evidence])} />
      </>}
      {tab === 1 && <>
        <PanelHeading label="02 / WORKBOOK SYLLABUS" title="All workbook lessons" detail="Search by topic, week, course, or exercise." />
        {search("Filter lessons")}
        <DataTable label="Engineering Mastery lessons" columns={["Lesson", "Week", "Learning goal", "Exercise", "Prerequisite", "Course"]} rows={lessons.map((lesson) => [
          lesson.title,
          <button key="week" className="study-link" type="button" onClick={() => openReferences(lesson.week)}>Week {lesson.week} resources</button>,
          lesson.goal, lesson.practice, lesson.prerequisite, lesson.course,
        ])} />
      </>}
      {tab === 2 && <>
        <PanelHeading label="03 / SKILL MATRIX" title="Foundational skills" detail="Find the subject and first study week for each skill in your workbook." />
        <CountFilters label="Skills by domain" values={data.skills.map((skill) => skill.domain)} selected={skillDomain} onSelect={setSkillDomain} />
        {search("Filter skills")}
        <DataTable label="Workbook skills" columns={["Skill", "Topic", "Domain", "First week"]} rows={data.skills.filter((r) => (!skillDomain || r.domain === skillDomain) && matches(query, [r.title, r.topic, r.domain, r.week])).map((r) => [r.title, r.topic, r.domain, r.week])} />
      </>}
      {tab === 3 && <>
        <PanelHeading label="04 / RESOURCE LIBRARY" title="Workbook study resources" detail="The full library follows the order of first use, with supplemental references after the weekly readings. Select a week for its assigned sequence." />
        <div className="career-controls study-resource-controls">
          <SearchField label="Search resources" value={query} onChange={setQuery} placeholder="Title, concept, or tool" autoFocus={referenceWeek !== undefined} />
          <label className="career-search"><span>Workbook week</span>
            <select value={referenceWeek ?? ""} onChange={(event) => setReferenceWeek(Number(event.target.value) || undefined)}>
              <option value="">All resources</option>
              {data.weeks.map((week) => <option value={week.week} key={week.week}>Week {week.week} · {week.title}</option>)}
            </select>
          </label>
        </div>
        <p className="career-result" aria-live="polite">{resources.length} of {library.length} resources shown</p>
        {resources.length === 0 && <p className="career-empty">No resources match your search.</p>}
        <ol className="study-resource-list">
          {resources.map((resource) => <li key={resource.url} value={library.indexOf(resource) + 1}><StudyResourceCard resource={resource} heading="h3" /></li>)}
        </ol>
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
