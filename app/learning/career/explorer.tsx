"use client";

import { useEffect, useState } from "react";
import type { Family } from "./catalog";
import type { PathCard } from "./path-cards";
import { CountFilters, DataTable, matches, SearchField } from "./workbench";

export function PathExplorer({ cards, families, view }: { cards: PathCard[]; families: Family[]; view: "cards" | "matrix" }) {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("");
  const [compare, setCompare] = useState<string[]>([]);
  const filtered = cards.filter((card) => (!family || family === card.family) &&
    matches(query, [card.title, card.family, ...card.roles, ...card.subjects, ...card.keywords]));
  const compared = cards.filter((card) => compare.includes(card.id));

  useEffect(() => {
    if (view !== "cards") return;
    function followLegacyMapLink() {
      if (window.location.hash === "#domain-map") window.location.replace("/learning/domain-map");
    }
    followLegacyMapLink();
    window.addEventListener("hashchange", followLegacyMapLink);
    return () => window.removeEventListener("hashchange", followLegacyMapLink);
  }, [view]);

  function changeCompare(id: string) {
    setCompare((selected) => selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id].slice(0, 3));
  }
  return (
    <>
      {view === "matrix" && <CountFilters label="Paths by career family" values={cards.map((card) => card.family)} selected={family} onSelect={setFamily} />}
      <div className="career-controls catalog-controls">
        <SearchField label="Find a path, role, or subject" value={query} onChange={setQuery} placeholder="Try Raft, quant, or Verilog" />
        <label className="career-search"><span>Career family</span><select value={family} onChange={(event) => setFamily(event.target.value)}>
          <option value="">All families</option>{families.map((name) => <option key={name}>{name}</option>)}
        </select></label>
      </div>
      <p className="career-result" aria-live="polite">{filtered.length} of {cards.length} paths{view === "matrix" && <><span>·</span>{compared.length} selected for comparison</>}</p>
      {view === "matrix" ? (
        <>
          {compared.length > 0 && (
            <div className="compare-panel">
              <div><h3>Compare paths</h3><button className="compare-clear" type="button" onClick={() => setCompare([])}>Clear selection</button></div>
              <DataTable label="Selected career paths" columns={["Path", "Target roles", "Prerequisites", "Subjects"]} rows={compared.map((card) => [
                <a key="path" href={`/learning/${card.id}`}>{card.title}</a>, card.roles.join(" · "), card.needs.join(" · "), card.subjects.join(" · "),
              ])} />
            </div>
          )}
          <DataTable label="Career role matrix" columns={["Career path", "Target roles", "Subjects", "Compare"]} rows={filtered.map((card) => [
            <a key="path" href={`/learning/${card.id}`}>{card.title}</a>, card.roles.join(" · "), card.subjects.join(" · "),
            <input key="compare" type="checkbox" aria-label={`Compare ${card.title}`} checked={compare.includes(card.id)} disabled={compare.length >= 3 && !compare.includes(card.id)} onChange={() => changeCompare(card.id)} />,
          ])} />
        </>
      ) : (
        <div className="career-family-list">
          {filtered.length === 0 && <p className="career-empty">No paths match. Try a different term or family.</p>}
          {families.map((name) => {
            const group = filtered.filter((card) => card.family === name);
            if (!group.length) return null;
            return (
              <section key={name} aria-label={name}>
                <div className="career-family-heading"><h2>{name}</h2><span>{group.length} {group.length === 1 ? "path" : "paths"}</span></div>
                <div className="notebook-card-grid career-grid">
                  {group.map((card) => (
                    <article className="notebook-card career-card" key={card.id} data-family={card.family}>
                      <div className="career-card-rail" aria-hidden="true"><i/><i/><i/></div>
                      <div className="career-card-body">
                        <p className="eyebrow">{card.sourced ? "CAREER COLLECTION" : "ADDED PATH"}</p>
                        <h3><a href={`/learning/${card.id}`}>{card.title}</a></h3>
                        <p>{card.intro}</p>
                        <ul className="topic-tags">{card.roles.slice(0, 2).map((role) => <li key={role}>{role}</li>)}</ul>
                        <p className="career-card-meta">{card.subjects.length} core subjects · {card.resources} linked resources</p>
                        <div className="career-card-footer"><a className="text-link" href={`/learning/${card.id}`}>Open path <span aria-hidden="true">→</span></a></div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
