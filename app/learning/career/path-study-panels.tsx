import { useState } from "react";
import type { StudyResource, StudyWeek } from "./study-plan-types";
import { matches, SearchField } from "./workbench";

type Module = { week: StudyWeek; number: number; subject: string; checkpoint: string };

function TopicGroups({ topics }: { topics: StudyWeek["topics"] }) {
  return (
    <div className="study-topic-groups">
      {topics.map(({ title, concepts }) => (
        <div key={title}>
          <h4>{title}</h4>
          <ul>{concepts.map((concept) => <li key={concept}>{concept}</li>)}</ul>
        </div>
      ))}
    </div>
  );
}

function Tools({ items }: { items: string[] }) {
  return <ul className="topic-tags study-tools" aria-label="Tools and technologies">
    {items.map((item) => <li key={item}>{item}</li>)}
  </ul>;
}

export function PathSyllabus({ modules, query, openResources }: {
  modules: Module[]; query: string; openResources: (week: number) => void;
}) {
  const filtered = modules.filter(({ week, number, subject }) => matches(query, [
    `week ${number}`, subject, week.title, week.practice, week.evidence, ...week.tools,
    ...week.topics.flatMap(({ title, concepts }) => [title, ...concepts]),
    ...week.resources.map(({ title }) => title),
  ]));

  if (!filtered.length) return <p className="career-empty">No modules match your search.</p>;

  return (
    <ol className="study-sequence" role="list" aria-label="Syllabus modules">
      {filtered.map(({ week, number }) => (
        <li className="study-card" key={number} value={number}>
          <header><p className="study-meta">Module {number} · Week {number}</p><h3>{week.title}</h3></header>
          <TopicGroups topics={week.topics} />
          {week.tools.length > 0 && <Tools items={week.tools} />}
          <p className="study-practice"><strong>Practice</strong>{week.practice}</p>
          <button className="study-link" type="button" onClick={() => openResources(number)}>See resources for week {number} <span aria-hidden="true">→</span></button>
        </li>
      ))}
    </ol>
  );
}

export function PathRoadmap({ modules, checked, toggle, openResources }: {
  modules: Module[]; checked: string[]; toggle: (id: string) => void; openResources: (week: number) => void;
}) {
  const complete = modules.filter(({ checkpoint }) => checked.includes(checkpoint)).length;
  return (
    <>
      <div className="career-progress">
        <span aria-live="polite">{complete} of {modules.length} weeks complete</span>
        <progress value={complete} max={modules.length} aria-label="Path progress" />
      </div>
      <ol className="study-sequence" role="list" aria-label="Weekly roadmap">
        {modules.map(({ week, number, checkpoint }) => (
          <li className="study-card" key={checkpoint}>
            <header><p className="study-meta">Week {number}</p><h3>{week.title}</h3></header>
            <TopicGroups topics={week.topics} />
            {week.tools.length > 0 && <Tools items={week.tools} />}
            <div className="study-assignment">
              <div><h4>Study in this order</h4>
                <ol className="study-reference-list">
                  {week.resources.map((resource) => (
                    <li key={resource.url}><a href={resource.url} target="_blank" rel="noreferrer">{resource.title} <span aria-hidden="true">↗</span></a></li>
                  ))}
                </ol>
                <button className="study-link" type="button" onClick={() => openResources(number)}>Read the study notes <span aria-hidden="true">→</span></button>
              </div>
              <div>
                <p className="study-practice"><strong>Practice</strong>{week.practice}</p>
                <p className="study-practice"><strong>Evidence of completion</strong>{week.evidence}</p>
              </div>
            </div>
            <label className="study-complete"><input type="checkbox" checked={checked.includes(checkpoint)} onChange={() => toggle(checkpoint)} /> Mark week {number} complete</label>
          </li>
        ))}
      </ol>
    </>
  );
}

export function QuantPhaseRoadmap({ phases }: {
  phases: { title: string; tempo: string; topics: string[]; references: StudyResource[] }[];
}) {
  return (
    <section className="study-phase-section" aria-label="Extended quant sequence">
      <h3 className="career-subheading">Extended quant sequence</h3>
      <ol className="study-sequence" role="list">
        {phases.map(({ title, tempo, topics, references }) => (
          <li key={title}>
            <details className="study-card study-phase">
              <summary><strong>{title}</strong>{tempo && <span className="study-phase-pace">{tempo}</span>}</summary>
              <div className="study-assignment">
                <div><h4>Topics</h4><ul className="table-topic-list">{topics.map((topic) => <li key={topic}>{topic}</li>)}</ul></div>
                <div><h4>References in study order</h4><ol className="study-reference-list">
                  {references.map(({ title, url }) => <li key={url}><a href={url} target="_blank" rel="noreferrer">{title} <span aria-hidden="true">↗</span></a></li>)}
                </ol></div>
              </div>
            </details>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function StudyResourceCard({ resource, heading: Heading = "h4" }: { resource: StudyResource; heading?: "h3" | "h4" }) {
  return (
    <article className="study-card study-resource">
      <header>
        <p className="study-meta">{resource.kind}</p>
        <Heading><a href={resource.url} target="_blank" rel="noreferrer">{resource.title} <span aria-hidden="true">↗</span></a></Heading>
      </header>
      <dl className="study-resource-details">
        <div><dt>What it covers</dt><dd>{resource.coverage}</dd></div>
        <div><dt>Why it matters</dt><dd>{resource.why}</dd></div>
        {resource.concepts.length > 0 && <div><dt>Concepts</dt><dd><ul>{resource.concepts.map((concept) => <li key={concept}>{concept}</li>)}</ul></dd></div>}
        {resource.tools.length > 0 && <div><dt>Tools & technologies</dt><dd><Tools items={resource.tools} /></dd></div>}
      </dl>
      <p className="study-practice"><strong>How to use it</strong>{resource.activity}</p>
    </article>
  );
}

export function PathResources({ modules, supplemental, initialWeek }: {
  modules: Module[]; supplemental: StudyResource[]; initialWeek: number | null;
}) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState(initialWeek?.toString() ?? "");
  const [kind, setKind] = useState("");
  const groups = [
    ...modules.map(({ number, week }) => ({ id: String(number), title: `Week ${number} · ${week.title}`, resources: week.resources })),
    ...(supplemental.length ? [{ id: "supplemental", title: "Supplemental references", resources: supplemental }] : []),
  ];
  const kinds = [...new Set(groups.flatMap(({ resources }) => resources.map((resource) => resource.kind)))].sort();
  const visible = groups.filter(({ id }) => !group || id === group).map((section) => ({
    ...section,
    entries: section.resources.map((resource, index) => ({ resource, number: index + 1 })).filter(({ resource }) =>
      (!kind || resource.kind === kind) && matches(query, [
        section.title, resource.kind, resource.title, resource.coverage, resource.why, resource.activity,
        ...resource.concepts, ...resource.tools,
      ])),
  })).filter(({ entries }) => entries.length > 0);
  const count = visible.reduce((sum, { entries }) => sum + entries.length, 0);

  return (
    <>
      <div className="career-controls study-resource-controls">
        <SearchField label="Search resources" value={query} onChange={setQuery} placeholder="Title, concept, or tool" autoFocus={initialWeek !== null} />
        <label className="career-search"><span>Study week</span><select value={group} onChange={(event) => setGroup(event.target.value)}>
          <option value="">All weeks and references</option>
          {groups.map(({ id, title }) => <option key={id} value={id}>{title}</option>)}
        </select></label>
        <label className="career-search"><span>Resource type</span><select value={kind} onChange={(event) => setKind(event.target.value)}>
          <option value="">All types</option>
          {kinds.map((type) => <option key={type}>{type}</option>)}
        </select></label>
      </div>
      <p className="career-result" aria-live="polite">{count} {count === 1 ? "resource" : "resources"} shown</p>
      {visible.length === 0 && <p className="career-empty">No resources match your search and filters.</p>}
      {visible.map(({ id, title, entries }) => (
        <section className="study-resource-group" key={id}>
          <h3>{title}</h3>
          <ol className="study-resource-list">
            {entries.map(({ resource, number }) => (
              <li key={resource.url} value={number}><StudyResourceCard resource={resource} /></li>
            ))}
          </ol>
        </section>
      ))}
    </>
  );
}
