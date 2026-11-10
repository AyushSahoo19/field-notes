"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { atlas, ExternalLink, precisionLab } from "../site-chrome";

const lanes = [
  {
    name: "Overview",
    label: "01 / MISSION",
    question: "Build from a problem worth solving.",
    description: "Avenra AI is an engineering and innovation initiative connecting AI, mathematics, software, and hardware with problems in real operations. It is for curious learners, engineers, researchers, and founders who want to understand how technology works and what it takes to put it to use.",
    topics: ["Problem discovery", "Engineering experiments", "Public learning"],
    areas: [
      ["Explore the problem", "Study the people, systems, and constraints behind a task. Use research, conversations, and proposed industry visits to see where the work gets difficult."],
      ["Build and test", "Start with a small prototype and a baseline. Record what worked, where it failed, and what would have to change before it could be used in the field."],
      ["Share the reasoning", "Publish ideas through technical explainers, founder stories, and Inside the Build notes that follow a decision from research to testing."],
    ],
    brief: {
      label: "EDITORIAL CONCEPT",
      title: "Inside the Build",
      description: "A recurring format for unpacking one engineering problem. Start with a diagram of the existing workflow, show the prototype and its test, then close with the trade-offs and open questions.",
      evidence: "A workflow diagram, a reproducible test or demonstration, and a short account of what the prototype can handle.",
    },
  },
  {
    name: "AI & automation",
    label: "02 / FOCUS AREA",
    question: "Where can AI make a workflow easier to verify?",
    description: "Explore assistants and automation around a specific task, with explicit inputs, permission boundaries, and a place for human review. Use simple rules or calculations wherever the result can be checked directly.",
    topics: ["Agent workflows", "Evaluation", "Computer vision"],
    areas: [
      ["Agents and tools", "Give an assistant a small set of tools and a clear task. Trace which tool ran, what it returned, and when the workflow needs approval."],
      ["Data and evidence", "Retrieve relevant source material, show where the answer came from, and flag missing or conflicting inputs for review."],
      ["Industrial automation", "Explore how a sensor reading or image becomes an alert, how a person verifies it, and how the outcome feeds back into the system."],
    ],
    brief: {
      label: "PRODUCT CONCEPT",
      title: "Avenra Intelligence OS",
      description: "An idea for bringing models, tools, memory, and human approval into repeatable workflows. A first experiment could turn sample equipment logs into a maintenance brief with citations and a review queue.",
      evidence: "A test set with missing or conflicting records, a trace of tool calls, and a record of when the reviewer had to correct the result.",
    },
  },
  {
    name: "Engineering & deep tech",
    label: "03 / FOCUS AREA",
    question: "What has to work beyond the demo?",
    description: "Break systems down into sensing, computation, and action. Study how data quality, latency, reliability, and hardware constraints change the design.",
    topics: ["Robotics", "Physical AI", "Semiconductors"],
    areas: [
      ["Sensing and perception", "Start with the signal itself. Explore calibration, noise, camera placement, and how uncertain readings affect a decision."],
      ["Robotics and control", "Follow a task from sensing and estimation through planning, feedback, and safe behavior when a component fails."],
      ["Computing and chips", "Trace which parts of a workload can run on-device and which need a server. Examine the trade-offs in memory, throughput, and power."],
    ],
    brief: {
      label: "PROTOTYPE IDEA",
      title: "Sensor-to-decision lab",
      description: "Use simulated machine data to compare a rule-based alert with a model-based alert. Show the signal, the trigger, and the event an engineer would inspect.",
      evidence: "A comparison of missed events, false alerts, and time to flag an event, with an explanation of where each method struggles.",
    },
  },
  {
    name: "Startups & industry",
    label: "04 / FOCUS AREA",
    question: "Can the idea improve an actual workflow?",
    description: "Study how founders and operations teams discover problems, decide who owns them, and test whether a proposed tool earns a place in the workflow.",
    topics: ["Industry visits", "Founder stories", "Pilot design"],
    areas: [
      ["Industry discovery", "Use a line walk or workflow interview to map recurring bottlenecks, handoffs, and the work people already do to manage them."],
      ["Founder and product studies", "Trace how a team chose its first user, narrowed the problem, tested the product, and decided which evidence mattered."],
      ["From prototype to pilot", "Start with one user group, one recurring task, and an outcome the people doing the work can evaluate."],
    ],
    brief: {
      label: "PRODUCT CONCEPT",
      title: "Avenra Verify",
      description: "Explore a review tool that compares sample invoices, purchase orders, and goods-received notes. It would surface missing or mismatched fields with supporting evidence for a reviewer.",
      evidence: "A synthetic document set with known mismatches, a report of which ones were found or missed, and the reviewer’s notes on ambiguous cases.",
    },
  },
  {
    name: "Build roadmap",
    label: "05 / PROPOSED ROADMAP",
    question: "What evidence moves an idea forward?",
    description: "Use these stages to decide whether to spend more time on an idea. Each stage ends with something the team can inspect before making that decision.",
    topics: ["Discovery", "Prototype", "Validation", "Documentation"],
    areas: [
      ["01 · Explore", "Choose one problem and identify the people who face it. Capture the current workflow, baseline, and constraints in a problem brief."],
      ["02 · Understand", "Identify the sources of error, data that can be used, and decisions that require review. Define the smallest useful test."],
      ["03 · Build", "Prototype one workflow and compare it against the baseline using examples that include failures and edge cases."],
      ["04 · Solve", "If the evidence supports a trial, define a pilot with an owner and a stop condition. Document the result and the next decision."],
    ],
    brief: {
      label: "PROJECT REVIEW",
      title: "A build note for each experiment",
      description: "Record the question, the existing workflow, the design decision, and the result. That record makes it easier to hand off a prototype, repeat a test, or decide which idea to drop.",
      evidence: "A problem brief, architecture sketch, baseline comparison, test results, and a next-step decision.",
    },
  },
];

export function AvenraLanes() {
  const [active, setActive] = useState(0);
  const groupId = useId();
  const lane = lanes[active];

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    let next: number;
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight": next = (active + 1) % lanes.length; break;
      case "ArrowUp":
      case "ArrowLeft": next = (active + lanes.length - 1) % lanes.length; break;
      case "Home": next = 0; break;
      case "End": next = lanes.length - 1; break;
      default: return;
    }
    event.preventDefault();
    setActive(next);
    event.currentTarget.parentElement?.querySelectorAll("button")[next]?.focus();
  }

  return (
    <div className="avenra-workbench avenra-expanded">
      <div className="avenra-tabs" role="tablist" aria-label="Avenra AI sections" aria-orientation="vertical">
        {lanes.map((item, index) => (
          <button key={item.name} id={`${groupId}-tab-${index}`} type="button" role="tab" aria-selected={active === index}
            aria-controls={`${groupId}-panel-${index}`} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={onKeyDown}>
            <span>0{index + 1}</span>{item.name}<span aria-hidden="true">→</span>
          </button>
        ))}
      </div>
      {lanes.map((item, index) => (
        <div key={item.name} className="avenra-panel" id={`${groupId}-panel-${index}`} role="tabpanel" aria-labelledby={`${groupId}-tab-${index}`}
          tabIndex={0} hidden={index !== active}>
          {index === active && <>
            <p className="eyebrow">{lane.label}</p>
            <h3>{lane.question}</h3>
            <p>{lane.description}</p>
            <ul className="topic-tags">{lane.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
            <div className="avenra-detail-grid" data-cards={lane.areas.length}>
              {lane.areas.map(([title, description]) => (
                <div className="avenra-detail-card" key={title}>
                  <h4>{title}</h4>
                  <p>{description}</p>
                </div>
              ))}
            </div>
            <div className="avenra-brief">
              <p className="eyebrow">{lane.brief.label}</p>
              <h4>{lane.brief.title}</h4>
              <p>{lane.brief.description}</p>
              <div className="avenra-brief-evidence">
                <p className="eyebrow">EVIDENCE TO COLLECT</p>
                <p>{lane.brief.evidence}</p>
              </div>
            </div>
          </>}
        </div>
      ))}
    </div>
  );
}

type Stage = "built" | "concept" | "research";
type Project = {
  title: string;
  initials: string;
  stage: Stage;
  domain: string;
  description: string;
  detail: string;
  link?: { label: string; href: string; note?: string };
};

const stages: Record<Stage, string> = { built: "Built", concept: "Concept", research: "Research proposal" };
const filters = [
  { id: "all", label: "All projects" },
  { id: "built", label: "Built work" },
  { id: "concept", label: "Concepts" },
  { id: "research", label: "Research" },
] as const;

const projects: Project[] = [
  { title: "QuarkX", initials: "QX", stage: "concept", domain: "FINANCE & AI", description: "A concept for mapping how companies, capital, FinTech, and AI fit together. It explores how businesses operate and where finance workflows could improve.", detail: "One line of exploration is FinOps. The startup track uses a hypothetical cloud-cost triage pilot to show how that kind of idea could be tested." },
  { title: "Indriya", initials: "IN", stage: "concept", domain: "EDUCATION", description: "A learning and career-guidance concept for students in India. It connects questions about what to study with possible paths, resources, and projects.", detail: "A possible first prototype would help a student compare two learning paths and pick a small project to try." },
  { title: "Genius", initials: "GE", stage: "concept", domain: "LEARNING SEARCH", description: "A search and discovery concept for curious learners. The idea is to organize courses, research, and technical updates around the questions a learner is trying to answer.", detail: "A possible first prototype would test search quality against a small set of real learning queries and compare the source links returned." },
  { title: "Supply-chain vulnerability ranking", initials: "VR", stage: "research", domain: "ACADEMIC RESEARCH", description: "A BCA research proposal to test whether dependency context helps prioritize software vulnerabilities compared with severity and exploitability baselines.", detail: "The proposed comparison uses features such as dependency depth and direct versus transitive dependencies, with an explainable web prototype to display rankings and their supporting factors." },
  { title: "AI Mastery Atlas", initials: "AI", stage: "built", domain: "AI EDUCATION", description: "A structured learning site with topic definitions, study sequences, reference materials, and project ideas across AI disciplines.", detail: "Use the searchable study tables to trace prerequisites and find resources for a topic.", link: { label: "Open the Atlas", href: atlas, note: "Site access required" } },
  { title: "Numerical Precision Lab", initials: "NP", stage: "built", domain: "APPLIED MATH", description: "A reproducible Python lab for inspecting rounding error and testing small numerical results against hand-checked cases.", detail: "The repository includes a test suite, example inputs, and instructions for running the experiments.", link: { label: "View on GitHub", href: precisionLab } },
];

export function ProjectIndex() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const visible = projects.filter((project) => filter === "all" || project.stage === filter);
  return (
    <>
      <div className="project-toolbar">
        <div className="filter-group" role="group" aria-label="Filter by project stage">
          {filters.map(({ id, label }) => <button type="button" key={id} aria-pressed={id === filter} onClick={() => setFilter(id)}>{label}</button>)}
        </div>
        <p aria-live="polite">{visible.length} {visible.length === 1 ? "project" : "projects"}</p>
      </div>
      <div className="notebook-card-grid studio-grid">
        {visible.map((project) => (
          <article key={project.title} className={`notebook-card studio-card stage-${project.stage}`}>
            <div className="studio-card-head">
              <span className="project-emblem" aria-hidden="true">{project.initials}</span>
              <span className="stage-chip"><span aria-hidden="true" />{stages[project.stage]}</span>
            </div>
            <p className="eyebrow">{project.domain}</p>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <details className="studio-detail">
              <summary>Project notes</summary><p>{project.detail}</p>
            </details>
            {project.link && <div className="studio-link"><ExternalLink className="text-link" href={project.link.href}>{project.link.label}</ExternalLink>{project.link.note && <span className="link-note">{project.link.note}</span>}</div>}
          </article>
        ))}
      </div>
    </>
  );
}
