"use client";

import { useEffect, useId, useState, type KeyboardEvent } from "react";
import { useBrowserState } from "../browser-state";
import { LifeBoxPanel } from "./activity-map";
import { DailyPlan } from "./daily-plan";
import { boxes, dateKey, dayLabel, dayOffset, emptyWeek, suggestedActivities, weekOf, type BoxId, type Outcome, type PlannerData, type WeekPlan } from "./life-data";

const emptyPlanner: PlannerData = {};
const isPlanner = (value: unknown): value is PlannerData => !!value && typeof value === "object" && !Array.isArray(value);
const tabs = [...boxes.map((box) => box.title), "Daily Plan", "Weekly Review"];
const dailyTab = boxes.length;
const reviewTab = dailyTab + 1;
const outcomeFields: { id: Outcome; label: string; prompt: string }[] = [
  { id: "study", label: "Study", prompt: "Topic or timed set" },
  { id: "build", label: "Build", prompt: "Engineering or Avenra deliverable" },
  { id: "life", label: "Life", prompt: "A commitment outside work" },
];

function toggle<T>(items: T[], item: T) {
  return items.includes(item) ? items.filter((value) => value !== item) : [...items, item];
}
function unschedule(week: WeekPlan, id: string) {
  const schedule = { ...week.schedule };
  delete schedule[id];
  return schedule;
}

export function LifePlanner() {
  const { value: plans, status, update } = useBrowserState("field-notes-life-boxes-v1", emptyPlanner, isPlanner);
  const [weekKey, setWeekKey] = useState("");
  const [today, setToday] = useState("");
  const [currentWeek, setCurrentWeek] = useState("");
  const [day, setDay] = useState(0);
  const [tab, setTab] = useState(0);
  const tabId = useId();

  function goToToday() {
    const date = new Date();
    const monday = weekOf(date);
    setToday(dateKey(date));
    setCurrentWeek(monday);
    setWeekKey(monday);
    setDay((date.getDay() + 6) % 7);
  }
  // Initialize after hydration so the first date comes from the visitor's time zone.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(goToToday, []);

  if (!weekKey || status === "loading") return <p className="planner-loading" role="status">Opening your weekly planner…</p>;

  const week = plans[weekKey] ?? emptyWeek;
  const tasks = [...suggestedActivities, ...week.custom];
  const done = tasks.filter((task) => week.checked.includes(task.id)).length;
  const planned = tasks.filter((task) => week.schedule[task.id] !== undefined).length;
  const boxTasks = boxes.map((box) => tasks.filter((task) => task.box === box.id));
  const end = dayOffset(weekKey, 6);
  const range = `${dayLabel(weekKey, { day: "numeric", month: "short", ...(end.slice(0, 4) !== weekKey.slice(0, 4) && { year: "numeric" }) })} – ${dayLabel(end, { day: "numeric", month: "short", year: "numeric" })}`;

  function updateWeek(change: (previous: WeekPlan) => WeekPlan) {
    update((previous) => ({ ...previous, [weekKey]: change(previous[weekKey] ?? emptyWeek) }));
  }
  function toggleActivity(id: string) {
    updateWeek((previous) => ({ ...previous, checked: toggle(previous.checked, id) }));
  }
  function addActivity(box: BoxId, title: string) {
    const id = `custom-${crypto.randomUUID()}`;
    updateWeek((previous) => ({ ...previous, custom: [...previous.custom, { id, box, title }] }));
  }
  function removeActivity(id: string) {
    updateWeek((previous) => ({
      ...previous, custom: previous.custom.filter((item) => item.id !== id),
      checked: previous.checked.filter((item) => item !== id), schedule: unschedule(previous, id),
    }));
  }

  function navigateTabs(event: KeyboardEvent<HTMLButtonElement>) {
    const forward = (tab + 1) % tabs.length;
    const back = (tab + tabs.length - 1) % tabs.length;
    const keys = new Map([["ArrowDown", forward], ["ArrowRight", forward], ["ArrowUp", back], ["ArrowLeft", back], ["Home", 0], ["End", tabs.length - 1]]);
    const next = keys.get(event.key);
    if (next === undefined) return;
    event.preventDefault();
    openTab(next);
  }

  function openTab(index: number) {
    setTab(index);
    document.getElementById(`${tabId}-tab-${index}`)?.focus();
  }

  return (
    <>
      <div className="life-workbench">
        <div className="life-workbench-top">
          <div className="life-week">
            <p className="eyebrow">{weekKey === currentWeek ? "CURRENT WEEK" : "SELECTED WEEK"}</p>
            <strong>{range}</strong>
          </div>
          <p className="life-week-stats"><span>{done}/{tasks.length} checked</span><span>{planned} scheduled</span><span>{week.reviewed.length}/8 reviewed</span></p>
          <div className="week-controls" role="group" aria-label="Change week">
            <button type="button" className="planner-button" aria-label="Previous week" onClick={() => setWeekKey(dayOffset(weekKey, -7))}>←</button>
            <button type="button" className="planner-button" onClick={goToToday}>This week</button>
            <button type="button" className="planner-button" aria-label="Next week" onClick={() => setWeekKey(dayOffset(weekKey, 7))}>→</button>
          </div>
        </div>
        <div className="life-workbench-body">
          <div className="avenra-tabs life-rail" role="tablist" aria-label="Life Boxes sections" aria-orientation="vertical">
            <p className="life-rail-label" aria-hidden="true">LIFE BOXES</p>
            {tabs.map((name, index) => {
              const box = boxes[index];
              const items = boxTasks[index];
              const complete = items?.filter((task) => week.checked.includes(task.id)).length ?? 0;
              return (
                <button type="button" key={name} id={`${tabId}-tab-${index}`} role="tab" aria-controls={`${tabId}-panel-${index}`}
                  aria-selected={tab === index} tabIndex={tab === index ? 0 : -1} onClick={() => setTab(index)} onKeyDown={navigateTabs}
                  className={box ? `life-tone-${box.tone}` : "life-rail-planning"}>
                  <span className="life-rail-index" aria-hidden="true">{box ? String(index + 1).padStart(2, "0") : index === dailyTab ? "↗" : "↻"}</span>
                  {name}
                  {box && <span className="life-rail-count" aria-hidden="true">{complete}/{items.length}</span>}
                </button>
              );
            })}
          </div>
          {tabs.map((name, index) => (
            <div key={name} className="life-panel" id={`${tabId}-panel-${index}`} role="tabpanel" aria-labelledby={`${tabId}-tab-${index}`} tabIndex={0} hidden={tab !== index}>
              {tab === index && index < dailyTab && <LifeBoxPanel key={weekKey} box={boxes[index]} index={index} week={week} tasks={boxTasks[index]} onToggle={toggleActivity} onAdd={addActivity} onRemove={removeActivity}
                onPlan={() => openTab(dailyTab)} />}
              {tab === index && index === dailyTab && <DailyPlan key={weekKey} weekKey={weekKey} today={today} day={day} week={week} tasks={tasks} onDay={setDay}
                onMode={(mode) => updateWeek((previous) => ({ ...previous, modes: { ...previous.modes, [day]: mode } }))}
                onSchedule={(id) => updateWeek((previous) => ({ ...previous, schedule: { ...previous.schedule, [id]: day } }))}
                onUnschedule={(id) => updateWeek((previous) => ({ ...previous, schedule: unschedule(previous, id) }))}
                onToggle={toggleActivity} />}
              {tab === index && index === reviewTab && <>
                <div className="planner-panel-heading"><div><p className="eyebrow">03 / SUNDAY REVIEW</p><h2>Choose your finish lines.</h2><p>Write three outcomes for the week, then review each life box and decide its next action.</p></div></div>
                <div className="review-grid">
                  <div className="planner-card review-outcomes">
                    <p className="eyebrow">THIS WEEK</p><h3>Three outcomes</h3>
                    {outcomeFields.map(({ id, label, prompt }) => <label key={id}><span>{label}</span><input value={week.outcomes[id]} maxLength={180} placeholder={prompt}
                      onChange={(event) => { const value = event.target.value; updateWeek((previous) => ({ ...previous, outcomes: { ...previous.outcomes, [id]: value } })); }} /></label>)}
                    <p>While exams lead, keep one engineering build and one Avenra experiment active.</p>
                  </div>
                  <div className="planner-card review-boxes">
                    <p className="eyebrow">REVIEW CHECKLIST</p><h3>{week.reviewed.length} of 8 boxes reviewed</h3>
                    <p>Check a box after you’ve reviewed it and chosen its next action. Carry forward the work that still matters.</p>
                    <ul>
                      {boxes.map((box) => <li key={box.id}>
                        <label><input type="checkbox" checked={week.reviewed.includes(box.id)} onChange={() => updateWeek((previous) => ({ ...previous, reviewed: toggle(previous.reviewed, box.id) }))} />{box.title}</label>
                        <input className="review-next-action" aria-label={`Next action for ${box.title}`} maxLength={140} placeholder="Next action" value={week.nextActions[box.id] ?? ""}
                          onChange={(event) => { const value = event.target.value; updateWeek((previous) => ({ ...previous, nextActions: { ...previous.nextActions, [box.id]: value } })); }} />
                      </li>)}
                    </ul>
                  </div>
                </div>
              </>}
            </div>
          ))}
        </div>
      </div>
      <p className="planner-save-status" role="status"><span />{status === "session" ? "Browser storage is unavailable. Changes last until you leave this page." : "Saved in this browser."}</p>
    </>
  );
}
