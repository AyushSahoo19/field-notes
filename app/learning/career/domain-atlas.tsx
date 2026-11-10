"use client";

import { useState } from "react";
import type { CareerPath, Family } from "./catalog";
import { domainLinks, layers, type DomainId, type DomainLink } from "./circuit-data";
import { DomainCircuit } from "./domain-circuit";

type AtlasDomain = Pick<CareerPath, "title" | "intro" | "family" | "needs" | "subjects" | "capstone">;
type Directory = Record<string, AtlasDomain>;

const nodes = layers.flatMap((layer) => layer.domains.map(([id, label]) => ({ id, label })));
const labels = new Map(nodes.map(({ id, label }) => [id, label]));
const edgesBySource = new Map<DomainId, DomainLink[]>(nodes.map(({ id }) => [id, domainLinks.filter((link) => link.from === id)]));
const matrixLabels: Record<DomainId, string> = {
  programming: "C++", algorithms: "DSA", math: "Math", architecture: "CPU",
  "operating-systems": "OS", networking: "Networks", databases: "DB", performance: "Perf.",
  quantum: "Quantum", backend: "APIs", "distributed-systems": "Dist. sys.", ai: "ML / DL",
  silicon: "Silicon", robotics: "Robotics", "quantum-hardware": "Q. hardware", "cloud-devops": "Cloud",
  "ai-agents": "Agents", finance: "Quant", "knowledge-systems": "Graphs", startups: "Startups", "career-portfolio": "Portfolio",
};
const views = [
  { id: "circuit", title: "Domain circuit", description: "Trace links across the atlas." },
  { id: "flows", title: "Topic flows", description: "Study topics in a practical order." },
  { id: "tree", title: "Prerequisite tree", description: "See what feeds into a domain." },
  { id: "matrix", title: "Connections matrix", description: "Compare links side by side." },
] as const;

function PathLink({ id, label = "Open learning path" }: { id: DomainId; label?: string }) {
  return <a className="atlas-path-link" href={`/learning/${id}`}>{label} <span aria-hidden="true">↗</span></a>;
}

function TopicFlow({ domain, id }: { domain: AtlasDomain; id: DomainId }) {
  const [stage, setStage] = useState(0);
  const steps = [
    ...domain.subjects.map(([title, topics, proof]) => ({ title, topics, proof })),
    { title: domain.capstone[0], topics: "Bring the preceding topics together in a portfolio project.", proof: domain.capstone[1] },
  ];
  const item = steps[stage];
  return (
    <>
      <ol className="atlas-flow" aria-label={`Study sequence for ${domain.title}`}>
        {steps.map(({ title }, index) => (
          <li key={title}>
            <button type="button" aria-pressed={stage === index} onClick={() => setStage(index)}>
              <span>{index === steps.length - 1 ? "CAPSTONE" : `STEP ${String(index + 1).padStart(2, "0")}`}</span>
              <strong>{title}</strong>
            </button>
          </li>
        ))}
      </ol>
      <div className="atlas-inspector">
        <div><p className="eyebrow">WHAT TO STUDY</p><h3>{item.title}</h3><p>{item.topics}</p></div>
        <div><p className="eyebrow">PRACTICE EVIDENCE</p><p>{item.proof}</p><PathLink id={id} /></div>
      </div>
    </>
  );
}

function PrerequisiteTree({ domains, id, onSelect }: { domains: Directory; id: DomainId; onSelect: (id: DomainId) => void }) {
  const incoming = (target: DomainId) => domainLinks.filter((edge) => edge.to === target && edge.kind === "learning");
  const branches = incoming(id);
  const domain = domains[id];
  return (
    <>
      <div className="atlas-tree-root"><span className="eyebrow">TARGET DOMAIN</span><strong>{domain.title}</strong><PathLink id={id} /></div>
      <p className="atlas-tree-direction">{branches.length ? "↑  Direct learning links" : "↑  Suggested starting knowledge"}</p>
      {branches.length ? (
        <ul className="atlas-tree" aria-label="Direct learning prerequisites">
          {branches.map(({ from, detail }) => {
            const earlier = incoming(from);
            return (
              <li key={from}>
                <button type="button" className="atlas-tree-node" onClick={() => onSelect(from)}>{labels.get(from)} <span aria-hidden="true">↗</span></button>
                <p>{detail}</p>
                {earlier.length > 0 && <><p className="eyebrow atlas-earlier">ONE STEP EARLIER</p>
                  <ul className="atlas-tree-leaves">{earlier.map((edge) => <li key={edge.from}><button type="button" onClick={() => onSelect(edge.from)}>{labels.get(edge.from)}</button></li>)}</ul>
                </>}
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className="atlas-tree atlas-tree-foundations" aria-label="Starting knowledge">
          {domain.needs.map((need) => <li key={need}><strong>{need}</strong></li>)}
        </ul>
      )}
    </>
  );
}

function ConnectionsMatrix({ domains, id, onSelect }: { domains: Directory; id: DomainId; onSelect: (id: DomainId) => void }) {
  const [family, setFamily] = useState<Family>(domains[id].family);
  const [selected, setSelected] = useState<DomainLink | null>(null);
  const families = [...new Set(Object.values(domains).map((domain) => domain.family))];
  const rows = nodes.filter((node) => domains[node.id].family === family);
  return (
    <>
      <div className="atlas-controls">
        <label className="career-search"><span>Source career family</span>
          <select value={family} onChange={(event) => { setFamily(event.target.value as Family); setSelected(null); }}>
            {families.map((name) => <option key={name}>{name}</option>)}
          </select>
        </label>
        <p className="atlas-key"><span><b>L</b> Learning</span><span><b>A</b> Application</span><span>– No direct link</span></p>
      </div>
      <div className="atlas-matrix-scroll" role="region" aria-label="Scrollable domain connections matrix" tabIndex={0}>
        <table className="atlas-matrix" aria-label="Connections from each row to each column">
          <thead><tr><th scope="col">From ↓ / To →</th>{nodes.map(({ id: target, label }) => <th scope="col" key={target} aria-label={label}><abbr title={label}>{matrixLabels[target]}</abbr></th>)}</tr></thead>
          <tbody>
            {rows.map(({ id: from, label }) => (
              <tr key={from}><th scope="row">{label}</th>
                {nodes.map(({ id: to }) => {
                  const edge = edgesBySource.get(from)?.find((link) => link.to === to);
                  return <td key={to}>{edge ? (
                    <button type="button" data-kind={edge.kind} aria-pressed={edge === selected} onClick={() => { setSelected(edge); onSelect(to); }}
                      aria-label={`${labels.get(from)} to ${labels.get(to)}, ${edge.kind} link`}>{edge.kind === "learning" ? "L" : "A"}</button>
                  ) : <span aria-label="No direct link">–</span>}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="atlas-inspector" aria-live="polite">
        {selected ? <><div><p className="eyebrow">{selected.kind.toUpperCase()} LINK</p><h3>{labels.get(selected.from)} → {labels.get(selected.to)}</h3><p>{selected.detail}</p></div>
          <div className="atlas-matrix-links"><PathLink id={selected.from} label="Open source path" /><PathLink id={selected.to} label="Open destination path" /></div></>
          : <p>Choose a marked cell to read how its source connects to the destination. Scroll to see every destination.</p>}
      </div>
    </>
  );
}

export function DomainAtlas({ domains }: { domains: Directory }) {
  const [view, setView] = useState<(typeof views)[number]["id"]>("circuit");
  const [focus, setFocus] = useState<DomainId | "">("ai");
  const id = focus || "ai";
  const domain = domains[id];
  return (
    <>
      <div className="atlas-view-picker" role="group" aria-label="Domain visualization">
        {views.map((item, index) => <button type="button" key={item.id} aria-pressed={view === item.id} onClick={() => setView(item.id)}>
          <span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong><small>{item.description}</small>
        </button>)}
      </div>
      {view === "circuit" ? <DomainCircuit directory={domains} focus={focus} onFocus={setFocus} /> : (
        <div className="atlas-diagram">
          {view !== "matrix" && <div className="atlas-controls">
            <label className="career-search"><span>Focus domain</span>
              <select value={id} onChange={(event) => setFocus(event.target.value as DomainId)}>
                {layers.map((layer) => <optgroup key={layer.title} label={layer.title}>{layer.domains.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</optgroup>)}
              </select>
            </label>
            <p>{view === "flows" ? "Choose a step to read its topics and practice task." : "Select a linked prerequisite to explore its own tree."}</p>
          </div>}
          {view === "flows" && <TopicFlow key={id} domain={domain} id={id} />}
          {view === "tree" && <PrerequisiteTree domains={domains} id={id} onSelect={setFocus} />}
          {view === "matrix" && <ConnectionsMatrix domains={domains} id={id} onSelect={setFocus} />}
        </div>
      )}
    </>
  );
}
