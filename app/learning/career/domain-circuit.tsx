"use client";

import { sitePath } from "../../../lib/site-path";
import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import { domainLinks, findRoute, layers, type DomainId, type DomainLink, type LinkKind } from "./circuit-data";

type DomainInfo = { title: string; intro: string };
type DomainDirectory = Record<string, DomainInfo>;
type Mode = "explore" | "trace";
type LinkFilter = "all" | LinkKind;

const canvasWidth = 1080;
const canvasHeight = 408;
const nodeWidth = 205;
const nodeHeight = 43;
const firstRow = 63;
const rowGap = 56;
const columnX = (column: number) => 24 + column * 274;
const zoomSteps = [0.76, 0.88, 1, 1.14, 1.28];

const nodes = layers.flatMap((layer, column) => layer.domains.map(([id, label], row) => ({
  id, label, column, tone: layer.tone, x: columnX(column), y: firstRow + row * rowGap,
})));
const nodeById = new Map(nodes.map((node) => [node.id, node]));
const nameOf = (id: DomainId) => nodeById.get(id)!.label;

function linkPath({ from, to }: DomainLink) {
  const start = nodeById.get(from)!;
  const end = nodeById.get(to)!;
  const y1 = start.y + nodeHeight / 2;
  const y2 = end.y + nodeHeight / 2;
  let x = start.x + nodeWidth + 2;
  let y = y1;
  let path = `M${x},${y}`;
  if (start.column === end.column) {
    const rail = x + 31;
    return `${path} C${rail},${y} ${rail},${y2} ${end.x + nodeWidth + 5},${y2}`;
  }

  function curve(nextX: number, nextY: number) {
    const mid = (x + nextX) / 2;
    path += ` C${mid},${y} ${mid},${nextY} ${nextX},${nextY}`;
    x = nextX;
    y = nextY;
  }
  for (let column = start.column + 1; column < end.column; column += 1) {
    const fraction = (column - start.column) / (end.column - start.column);
    const interpolated = y1 + (y2 - y1) * fraction;
    const firstGutter = firstRow + (nodeHeight + rowGap) / 2;
    const gutterY = firstGutter + Math.round((interpolated - firstGutter) / rowGap) * rowGap;
    curve(columnX(column) - 6, gutterY);
    x = columnX(column) + nodeWidth + 6;
    path += ` H${x}`;
  }
  curve(end.x - 5, y2);
  return path;
}

const pathsByLink = new Map(domainLinks.map((edge) => [edge, linkPath(edge)]));
const routes: { label: string; from: DomainId; to: DomainId }[] = [
  { label: "Math to agents", from: "math", to: "ai-agents" },
  { label: "Architecture to HFT", from: "architecture", to: "finance" },
  { label: "Networking to cloud", from: "networking", to: "cloud-devops" },
];

function DomainSelect({ label, value, onChange, allowAll }: {
  label: string; value: DomainId | ""; onChange: (id: DomainId | "") => void; allowAll?: boolean;
}) {
  function select(event: ChangeEvent<HTMLSelectElement>) {
    const id = event.target.value;
    if (id === "" || nodeById.has(id as DomainId)) onChange(id as DomainId | "");
  }

  return (
    <label className="circuit-field">
      <span>{label}</span>
      <select value={value} onChange={select}>
        {allowAll && <option value="">All domains</option>}
        {layers.map((layer) => <optgroup key={layer.title} label={layer.title}>
          {layer.domains.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
        </optgroup>)}
      </select>
    </label>
  );
}

function ConnectionList({ title, links, incoming, onSelect }: {
  title: string; links: DomainLink[]; incoming?: boolean; onSelect: (id: DomainId) => void;
}) {
  return (
    <div className="circuit-connections">
      <h4>{title} <span>{links.length}</span></h4>
      {links.length === 0 && <p className="circuit-no-links">No links in this direction for the selected filter.</p>}
      <ul>
        {links.map((edge) => {
          const id = incoming ? edge.from : edge.to;
          return (
            <li key={id}>
              <div className="circuit-connection-label">
                <button type="button" onClick={() => onSelect(id)} className="circuit-related">{nameOf(id)} <span aria-hidden="true">→</span></button>
                <span className="circuit-link-kind" data-kind={edge.kind}>{edge.kind === "learning" ? "Learning" : "Application"}</span>
              </div>
              <p>{edge.detail}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function RouteDetails({ route, from, to }: { route: DomainLink[] | null; from: DomainId; to: DomainId }) {
  if (!route) {
    return <div className="circuit-inspector"><h3>No forward route found</h3><p>Try another destination, swap the endpoints, or include all link types.</p></div>;
  }

  const stops = [from, ...route.map((edge) => edge.to)];
  return (
    <div className="circuit-inspector">
      <p className="eyebrow">TRACED ROUTE</p>
      <h3>{nameOf(from)} {from !== to && <><span aria-hidden="true">→</span> {nameOf(to)}</>}</h3>
      <p>{route.length ? "The shortest forward route through the selected links. Use it to explore how each skill carries into the next domain." : "Both endpoints are the same. Choose another destination to trace a connection."}</p>
      <ol className="circuit-route">
        {stops.map((id, i) => (
          <li key={id}>
            <span className="circuit-step">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <a href={sitePath(`/learning/${id}`)}>{nameOf(id)} <span aria-hidden="true">↗</span></a>
              {i > 0 && <p>{route[i - 1].detail}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function DomainCircuit({ directory, focus, onFocus }: {
  directory: DomainDirectory; focus: DomainId | ""; onFocus: (domain: DomainId | "") => void;
}) {
  const [mode, setMode] = useState<Mode>("explore");
  const [from, setFrom] = useState<DomainId>("math");
  const [to, setTo] = useState<DomainId>("ai-agents");
  const [filter, setFilter] = useState<LinkFilter>("all");
  const [zoomIndex, setZoomIndex] = useState(2);
  const viewport = useRef<HTMLDivElement>(null);
  const marker = useId();
  const zoom = zoomSteps[zoomIndex];
  const visible = domainLinks.filter((edge) => filter === "all" || edge.kind === filter);
  const incoming = visible.filter((edge) => edge.to === focus);
  const outgoing = visible.filter((edge) => edge.from === focus);
  const route = mode === "trace" ? findRoute(visible, from, to) : null;
  const emphasized = new Set(mode === "trace" ? route ?? [] : [...incoming, ...outgoing]);
  const selected = mode === "trace" ? to : focus;
  const showAll = mode === "explore" && !focus;
  const related = new Set([...emphasized].flatMap(({ from: start, to: end }) => [start, end]));
  const current = focus ? directory[focus] : undefined;

  useEffect(() => {
    if (!selected || !viewport.current) return;
    const scroller = viewport.current;
    const left = nodeById.get(selected)!.x * zoom;
    const width = nodeWidth * zoom;
    const { scrollLeft, clientWidth } = scroller;
    if (left < scrollLeft || left + width > scrollLeft + clientWidth) {
      scroller.scrollLeft = left + (width - clientWidth) / 2;
    }
  }, [selected, zoom]);

  const status = mode === "trace"
    ? route ? `${route.length} route ${route.length === 1 ? "link" : "links"}` : "No forward route"
    : focus ? `${nameOf(focus)} · ${emphasized.size} direct links` : `${nodes.length} domains · ${visible.length} links`;

  return (
    <div className="domain-circuit">
      <div className="circuit-toolbar">
        <div className="circuit-control-row">
          <p className="circuit-kicker"><span className="dot" /> DOMAIN CIRCUIT <span>{nodes.length} DOMAINS</span></p>
          <div className="circuit-modes" role="group" aria-label="Map mode">
            <button type="button" aria-pressed={mode === "explore"} onClick={() => setMode("explore")}>Explore</button>
            <button type="button" aria-pressed={mode === "trace"} onClick={() => setMode("trace")}>Trace a route</button>
          </div>
        </div>
        <div className="circuit-control-row circuit-inputs">
          {mode === "explore"
            ? <DomainSelect label="Focus domain" value={focus} onChange={onFocus} allowAll />
            : <>
              <DomainSelect label="From domain" value={from} onChange={(id) => { if (id) setFrom(id); }} />
              <button type="button" className="circuit-swap" aria-label="Swap start and destination" onClick={() => { setFrom(to); setTo(from); }}>⇄ <span>Swap</span></button>
              <DomainSelect label="Destination" value={to} onChange={(id) => { if (id) setTo(id); }} />
            </>}
          <label className="circuit-field">
            <span>Link type</span>
            <select value={filter} onChange={(event) => setFilter(event.target.value as LinkFilter)}>
              <option value="all">All links</option><option value="learning">Learning links</option><option value="application">Applications</option>
            </select>
          </label>
          <div className="circuit-zoom">
            <span>Zoom</span>
            <div className="circuit-modes" role="group" aria-label="Map zoom">
              <button type="button" aria-label="Zoom out" disabled={zoomIndex === 0} onClick={() => setZoomIndex(zoomIndex - 1)}>−</button>
              <button type="button" aria-label={`Reset zoom (current ${Math.round(zoom * 100)}%)`} onClick={() => setZoomIndex(2)}>{Math.round(zoom * 100)}%</button>
              <button type="button" aria-label="Zoom in" disabled={zoomIndex === zoomSteps.length - 1} onClick={() => setZoomIndex(zoomIndex + 1)}>+</button>
            </div>
          </div>
        </div>
        {mode === "trace" && <div className="circuit-presets" aria-label="Example routes">
          <span>Try a route</span>
          {routes.map((item) => <button type="button" key={item.label} onClick={() => { setFrom(item.from); setTo(item.to); }}>{item.label}</button>)}
        </div>}
      </div>

      <div className="circuit-viewport" ref={viewport} tabIndex={0} role="region" aria-label="Scrollable interactive domain map">
        <div className="circuit-scene" style={{ width: canvasWidth * zoom, height: canvasHeight * zoom }}>
          <div className="circuit-canvas" style={{ width: canvasWidth, height: canvasHeight, transform: `scale(${zoom})` }}>
            {layers.map((layer, column) => (
              <div key={layer.title} className={`circuit-lane circuit-tone-${layer.tone}`} aria-hidden="true" style={{ left: columnX(column) - 8, width: nodeWidth + 16 }}>
                <span>{String(column + 1).padStart(2, "0")}</span><strong>{layer.title}</strong>
              </div>
            ))}
            <svg className="circuit-wires" viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} aria-hidden="true">
              <defs>
                <marker id={`${marker}-learning`} viewBox="0 0 7 8" refX="6" refY="4" markerWidth="7" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L7 4L0 8Z" className="circuit-marker-learning" /></marker>
                <marker id={`${marker}-application`} viewBox="0 0 7 8" refX="6" refY="4" markerWidth="7" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L7 4L0 8Z" className="circuit-marker-application" /></marker>
              </defs>
              {[...visible.filter((edge) => !emphasized.has(edge)), ...emphasized].map((edge) => {
                const active = emphasized.has(edge);
                return (
                  <path key={`${edge.from}-${edge.to}`} d={pathsByLink.get(edge)}
                    className={`circuit-wire circuit-wire-${edge.kind} ${active ? "is-active" : showAll ? "is-overview" : "is-muted"}`}
                    markerEnd={active || showAll ? `url(#${marker}-${edge.kind})` : undefined} />
                );
              })}
            </svg>
            {nodes.map((node) => (
              <button type="button" key={node.id}
                className={`circuit-node circuit-tone-${node.tone} ${related.has(node.id) ? "is-related" : ""}`}
                aria-label={`${node.label}, ${layers[node.column].title}`}
                aria-pressed={mode === "trace" ? node.id === from || node.id === to : node.id === focus}
                onClick={() => mode === "trace" ? setTo(node.id) : onFocus(node.id)}
                style={{ left: node.x, top: node.y, width: nodeWidth, height: nodeHeight }}>
                <span className="circuit-node-dot" aria-hidden="true" />
                <span>{node.label}</span>
                {mode === "trace" && node.id === from && <small>FROM</small>}
                {node.id === selected && node.id !== (mode === "trace" ? from : "") && <small>{mode === "trace" ? "TO" : "FOCUS"}</small>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="circuit-legend">
        <div><span className="circuit-key"><i /> Learning link</span><span className="circuit-key circuit-key-app"><i /> Application link</span></div>
        <p aria-live="polite">{status}</p>
        <span className="circuit-pan-hint">Swipe to see the other layers.</span>
      </div>
      {mode === "trace" ? <RouteDetails route={route} from={from} to={to} /> : current && focus ? (
        <div className="circuit-inspector">
          <div className="circuit-inspector-header">
            <div><p className="eyebrow">DOMAIN IN FOCUS</p><h3>{current.title}</h3><p>{current.intro}</p></div>
            <a className="circuit-open-path" href={sitePath(`/learning/${focus}`)}>Open learning path <span aria-hidden="true">→</span></a>
          </div>
          <div className="circuit-connection-grid">
            <ConnectionList title="What feeds into it" links={incoming} incoming onSelect={onFocus} />
            <ConnectionList title="Where it leads" links={outgoing} onSelect={onFocus} />
          </div>
        </div>
      ) : (
        <div className="circuit-inspector"><h3>Explore the full circuit</h3><p>Select a domain to read the links that feed into it and the projects or disciplines it can support.</p></div>
      )}
    </div>
  );
}
