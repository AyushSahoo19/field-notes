"use client";

import { useEffect, useState, type KeyboardEvent, type ReactNode } from "react";

export function Workbench({ id, title, tabs, active, onChange, children }: {
  id: string; title: string; tabs: string[]; active: number; onChange: (index: number) => void; children: ReactNode;
}) {
  function navigate(event: KeyboardEvent<HTMLButtonElement>) {
    const keys: Record<string, number> = {
      ArrowDown: (active + 1) % tabs.length, ArrowRight: (active + 1) % tabs.length,
      ArrowUp: (active + tabs.length - 1) % tabs.length, ArrowLeft: (active + tabs.length - 1) % tabs.length,
      Home: 0, End: tabs.length - 1,
    };
    const next = keys[event.key];
    if (next === undefined) return;
    event.preventDefault();
    onChange(next);
    event.currentTarget.parentElement?.querySelectorAll("button")[next]?.focus();
  }
  return (
    <div className="avenra-workbench career-workbench">
      <div className="avenra-tabs career-tabs" role="tablist" aria-label={title} aria-orientation="vertical">
        {tabs.map((tab, index) => (
          <button type="button" key={tab} id={`${id}-tab-${index}`} role="tab" aria-selected={active === index}
            aria-controls={`${id}-panel-${index}`} tabIndex={active === index ? 0 : -1} onKeyDown={navigate} onClick={() => onChange(index)}>
            <span>{String(index + 1).padStart(2, "0")}</span>{tab}<span aria-hidden="true">→</span>
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div key={tab} id={`${id}-panel-${index}`} role="tabpanel" aria-labelledby={`${id}-tab-${index}`}
          tabIndex={0} hidden={active !== index} className="career-panel">
          {active === index && children}
        </div>
      ))}
    </div>
  );
}

export function DataTable({ columns, rows, label }: { columns: string[]; rows: ReactNode[][]; label: string }) {
  if (rows.length === 0) return <p className="career-empty">No matching entries. Try a different search.</p>;
  return (
    <div className="career-table-wrap" tabIndex={0} role="region" aria-label={label}>
      <table className="career-table" aria-label={label}>
        <thead><tr>{columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr></thead>
        <tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, i) => i === 0 ? <th key={i} scope="row">{cell}</th> : <td key={i}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export function SearchField({ label, value, onChange, placeholder, autoFocus }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; autoFocus?: boolean }) {
  return <label className="career-search"><span>{label}</span><input type="search" autoFocus={autoFocus} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} /></label>;
}

export function PanelHeading({ label, title, detail }: { label: string; title: string; detail?: string }) {
  return <div className="career-panel-heading"><p className="eyebrow">{label}</p><h2>{title}</h2>{detail && <p>{detail}</p>}</div>;
}

const matches = (query: string, values: (string | number | null | undefined)[]) => {
  const text = values.join(" ").toLowerCase();
  return query.toLowerCase().trim().split(/\s+/).every((term) => text.includes(term));
};
export { matches };

export function CountFilters({ label, values, selected, onSelect }: {
  label: string; values: string[]; selected: string; onSelect: (value: string) => void;
}) {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  if (counts.size < 2) return null;
  const max = Math.max(...counts.values());

  return (
    <div className="career-count-chart" role="group" aria-label={label}>
      {[...counts].map(([name, count]) => (
        <button type="button" key={name} aria-pressed={selected === name} onClick={() => onSelect(selected === name ? "" : name)}>
          <span>{name}</span><strong>{count}</strong>
          <span className="career-count-bar" aria-hidden="true"><i style={{ width: `${100 * count / max}%` }} /></span>
        </button>
      ))}
    </div>
  );
}

export function useChecklist(key: string) {
  const [checked, setChecked] = useState<string[]>([]);
  useEffect(() => {
    try {
      const raw: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
      // Restore the browser's saved progress after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (Array.isArray(raw) && raw.every((item) => typeof item === "string")) setChecked(raw);
    } catch { /* Storage can be unavailable in a private session. */ }
  }, [key]);
  function toggle(item: string) {
    const next = checked.includes(item) ? checked.filter((id) => id !== item) : [...checked, item];
    setChecked(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* Keep session state. */ }
  }
  return { checked, toggle };
}

export function MilestoneMap({ stages, active, onSelect }: { stages: string[]; active: number; onSelect: (index: number) => void }) {
  return <div className="milestone-map" role="group" aria-label="Explore roadmap stages">{stages.map((stage, i) => (
    <button key={stage} type="button" aria-pressed={active === i} onClick={() => onSelect(i)}>
      <span>{String(i + 1).padStart(2, "0")}</span><strong>{stage}</strong>
    </button>
  ))}</div>;
}
