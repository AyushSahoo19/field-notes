"use client";

import { sitePath } from "../../lib/site-path";
import { useState, type FormEvent } from "react";
import { Icon } from "../site-chrome";
import { useBrowserState } from "./browser-state";

const categories = ["Learning", "Time management", "Performance", "Other"] as const;
type Category = (typeof categories)[number];
type Framework = { id: string; title: string; category: Category; purpose: string; activities: string[]; checked: string[] };
type Draft = { id?: string; title: string; category: Category; purpose: string; activities: string };
const emptyShelf: Framework[] = [];
const emptyDraft: Draft = { title: "", category: "Learning", purpose: "", activities: "" };
const isShelf = (value: unknown): value is Framework[] => Array.isArray(value);

export function FrameworkShelf() {
  const { value: saved, update, status } = useBrowserState("field-notes-frameworks-v1", emptyShelf, isShelf);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function edit(framework: Framework) {
    setError("");
    setDraft({ ...framework, activities: framework.activities.join("\n") });
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    const title = draft.title.trim();
    const purpose = draft.purpose.trim();
    const activities = [...new Set(draft.activities.split("\n").map((s) => s.trim()).filter(Boolean))];
    if (!title || !purpose || activities.length === 0) {
      setError("Enter a title, a purpose, and at least one activity.");
      return;
    }
    const id = draft.id ?? crypto.randomUUID();
    update((previous) => {
      const existing = previous.find((item) => item.id === id);
      const framework = { id, title, purpose, category: draft.category, activities, checked: existing?.checked.filter((s) => activities.includes(s)) ?? [] };
      return existing ? previous.map((item) => item.id === id ? framework : item) : [...previous, framework];
    });
    setDraft(null);
    setNotice(draft.id ? "Framework updated." : "Framework added.");
  }

  function toggle(id: string, activity: string) {
    update((previous) => previous.map((item) => item.id !== id ? item : {
      ...item,
      checked: item.checked.includes(activity) ? item.checked.filter((s) => s !== activity) : [...item.checked, activity],
    }));
  }

  return (
    <>
      <div className="framework-section-header">
        <div><p className="eyebrow">01 / FRAMEWORK LIBRARY</p><h2 id="framework-library-title">Your frameworks<span>.</span></h2></div>
        <button type="button" className="planner-button planner-button-primary" disabled={status === "loading"} onClick={() => { setError(""); setDraft(emptyDraft); }}>+ Add a framework</button>
      </div>
      <p className="framework-shelf-note">{status === "session" ? "Browser storage is unavailable. Changes last until you leave this page." : "Custom frameworks and their checklists are saved in this browser."}</p>
      <p className="framework-shelf-notice" role="status">{notice}</p>
      {draft && (
        <form className="framework-editor" onSubmit={save}>
          <h3>{draft.id ? "Edit framework" : "Add a framework"}</h3>
          <div className="framework-editor-fields">
            <label>Framework name<input autoFocus required maxLength={72} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Deep study routine" /></label>
            <label>Category<select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as Category })}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
          </div>
          <label>What is it for?<input required maxLength={180} value={draft.purpose} onChange={(e) => setDraft({ ...draft, purpose: e.target.value })} placeholder="Turn a difficult topic into a result I can explain." /></label>
          <label>Activities, one per line<textarea required maxLength={1600} rows={4} value={draft.activities} onChange={(e) => setDraft({ ...draft, activities: e.target.value })} placeholder={"Read the definition\nSolve a worked example\nExplain it from memory"} /></label>
          {error && <p className="planner-error" role="alert">{error}</p>}
          <div className="framework-form-actions"><button className="planner-button planner-button-primary" type="submit">Save framework</button><button className="planner-button" type="button" onClick={() => setDraft(null)}>Cancel</button></div>
        </form>
      )}
      <div className="framework-card-grid">
        <article className="framework-card framework-feature">
          <p className="eyebrow">01 / TIME MANAGEMENT</p>
          <h3>My 8 Life Boxes</h3>
          <p>One map for work, exams, Avenra, money, health, relationships, and creative life. Schedule the activities you choose and review the week.</p>
          <ul className="framework-card-tags"><li>8 activity boxes</li><li>Daily plans</li><li>Weekly review</li></ul>
          <a className="planner-button planner-button-primary" href={sitePath("/frameworks/life-boxes")}>Open framework <Icon name="arrow" /></a>
        </article>
        {saved.map((item) => (
          <article className="framework-card" key={item.id}>
            <p className="eyebrow">{item.category.toUpperCase()} / CUSTOM</p>
            <h3>{item.title}</h3><p>{item.purpose}</p>
            <details className="framework-checklist">
              <summary>Activities <span>{item.checked.length}/{item.activities.length}</span></summary>
              <ul>{item.activities.map((activity) => <li key={activity}><label><input type="checkbox" checked={item.checked.includes(activity)} onChange={() => toggle(item.id, activity)} />{activity}</label></li>)}</ul>
            </details>
            <button type="button" className="planner-button" onClick={() => edit(item)}>Edit {item.title}</button>
          </article>
        ))}
      </div>
    </>
  );
}
