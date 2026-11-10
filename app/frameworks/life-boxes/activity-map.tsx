"use client";

import { useState, type FormEvent } from "react";
import { boxes, dayNames, type Activity, type BoxId, type WeekPlan } from "./life-data";

export function ActivityCheck({ activity, checked, onToggle }: { activity: Activity; checked: boolean; onToggle: () => void }) {
  return <label className="activity-check"><input type="checkbox" checked={checked} onChange={onToggle} /><span>{activity.title}</span></label>;
}

function AddActivity({ box, onAdd }: { box: BoxId; onAdd: (box: BoxId, title: string) => void }) {
  const [title, setTitle] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;
    onAdd(box, title.trim());
    setTitle("");
  }
  return (
    <details className="add-activity">
      <summary>+ Add activity</summary>
      <form onSubmit={submit}>
        <label className="planner-sr-only" htmlFor={`activity-${box}`}>New activity for {boxes.find((item) => item.id === box)?.title}</label>
        <input id={`activity-${box}`} value={title} required maxLength={140} placeholder="Write one specific action" onChange={(event) => setTitle(event.target.value)} />
        <button type="submit" className="planner-button planner-button-primary">Add</button>
      </form>
    </details>
  );
}

export function LifeBoxPanel({ box, index, week, tasks, onToggle, onAdd, onRemove, onPlan }: {
  box: (typeof boxes)[number]; index: number; week: WeekPlan; tasks: Activity[];
  onToggle: (id: string) => void; onAdd: (box: BoxId, title: string) => void;
  onRemove: (id: string) => void; onPlan: () => void;
}) {
  const done = tasks.filter((task) => week.checked.includes(task.id)).length;
  return (
    <div className={`life-box-detail life-tone-${box.tone}`}>
      <div className="planner-panel-heading">
        <div>
          <p className="eyebrow">LIFE BOX / {String(index + 1).padStart(2, "0")}</p>
          <h2>{box.title}</h2>
          <p>{box.cadence}</p>
        </div>
        <span className="life-box-count">{done} of {tasks.length} checked</span>
      </div>
      <ul className="life-activities">
        {tasks.map((task) => (
          <li key={task.id}>
            <ActivityCheck activity={task} checked={week.checked.includes(task.id)} onToggle={() => onToggle(task.id)} />
            {week.schedule[task.id] !== undefined && <span className="scheduled-tag" title={dayNames[week.schedule[task.id]]}>{dayNames[week.schedule[task.id]].slice(0, 3)}</span>}
            {task.id.startsWith("custom-") && <button className="activity-remove" type="button" onClick={() => onRemove(task.id)} aria-label={`Remove ${task.title}`}>×</button>}
          </li>
        ))}
      </ul>
      <div className="life-box-actions">
        <AddActivity box={box.id} onAdd={onAdd} />
        <button type="button" className="planner-button" onClick={onPlan}>Schedule activities <span aria-hidden="true">→</span></button>
      </div>
    </div>
  );
}
