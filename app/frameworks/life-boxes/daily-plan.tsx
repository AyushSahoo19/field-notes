"use client";

import { useState, type FormEvent } from "react";
import { ActivityCheck } from "./activity-map";
import { boxes, dayLabel, dayNames, dayOffset, rotation, timeBlocks, type Activity, type DayMode, type WeekPlan } from "./life-data";

const modes: { id: DayMode; label: string }[] = [
  { id: "normal", label: "Normal day" },
  { id: "short", label: "Demanding shift" },
  { id: "reset", label: "Sunday reset" },
];

export function DailyPlan({ weekKey, today, day, week, tasks, onDay, onMode, onSchedule, onUnschedule, onToggle }: {
  weekKey: string; today: string; day: number; week: WeekPlan; tasks: Activity[];
  onDay: (day: number) => void; onMode: (mode: DayMode) => void; onSchedule: (id: string) => void;
  onUnschedule: (id: string) => void; onToggle: (id: string) => void;
}) {
  const [pick, setPick] = useState("");
  const mode = week.modes[day] ?? (day === 6 ? "reset" : "normal");
  const blocks = timeBlocks(mode, day);
  const total = blocks.reduce((sum, block) => sum + block.minutes, 0);
  const scheduled = tasks.filter((task) => week.schedule[task.id] === day);
  const done = scheduled.filter((task) => week.checked.includes(task.id)).length;
  const date = dayOffset(weekKey, day);

  function schedule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!tasks.some((task) => task.id === pick)) return;
    onSchedule(pick);
    setPick("");
  }

  return (
    <>
      <div className="planner-panel-heading">
        <div><p className="eyebrow">02 / RUN YOUR DAY</p><h2>Make a plan for {dayNames[day]}.</h2><p>Choose a time plan that fits your shift. Add the activities you want to do that day.</p></div>
      </div>
      <div className="day-strip" role="group" aria-label="Choose a day">
        {dayNames.map((name, index) => {
          const key = dayOffset(weekKey, index);
          return <button type="button" key={name} aria-pressed={day === index} aria-label={`${name} ${dayLabel(key, { day: "numeric", month: "short" })}${key === today ? ", today" : ""}`} onClick={() => { setPick(""); onDay(index); }}>
            <span>{name.slice(0, 3)}</span><strong>{dayLabel(key, { day: "numeric" })}</strong>{key === today && <i aria-hidden="true" />}
          </button>;
        })}
      </div>
      <div className="day-plan-grid">
        <div className="planner-card day-timing">
          <div className="day-timing-head"><div><p className="eyebrow">TIME PLAN</p><h3>{total} minutes</h3></div><p>{dayLabel(date, { weekday: "short", day: "numeric", month: "short" })}</p></div>
          <div className="plan-modes" role="group" aria-label="Choose a time plan">
            {modes.map((item) => <button type="button" key={item.id} aria-pressed={mode === item.id} onClick={() => onMode(item.id)}>{item.label}</button>)}
          </div>
          <div className="day-time-bar" aria-hidden="true">{blocks.map((block) => <span className={`life-tone-${block.tone}`} key={block.title} style={{ flex: block.minutes }} />)}</div>
          <ul className="day-time-blocks">{blocks.map((block) => <li key={block.title} className={`life-tone-${block.tone}`}><i /><span>{block.title}</span><strong>{block.minutes} min</strong></li>)}</ul>
          <p className="day-timing-note">{mode === "short" ? "After a demanding shift, keep the plan short and protect sleep." : mode === "reset" ? rotation[6].detail : day === 6 ? "Choose a project based on this week’s outcomes." : rotation[day].detail}</p>
        </div>
        <div className="planner-card day-schedule">
          <p className="eyebrow">ACTIVITIES ON THIS DAY</p><h3>{scheduled.length ? `${done} of ${scheduled.length} done` : "Pick your first activity"}</h3>
          <p className="day-schedule-note">Checkmarks stay in sync with your life boxes.</p>
          <form onSubmit={schedule} className="day-schedule-form">
            <label>Activity
              <select required value={pick} onChange={(event) => setPick(event.target.value)}>
                <option value="">Choose from the life boxes</option>
                {boxes.map((box) => {
                  const options = tasks.filter((task) => task.box === box.id && week.schedule[task.id] !== day);
                  return options.length > 0 && <optgroup key={box.id} label={box.title}>{options.map((task) => <option key={task.id} value={task.id}>{task.title}{week.schedule[task.id] === undefined ? "" : ` · move from ${dayNames[week.schedule[task.id]]}`}</option>)}</optgroup>;
                })}
              </select>
            </label>
            <button className="planner-button planner-button-primary" type="submit" disabled={!pick}>Schedule</button>
          </form>
          {scheduled.length > 0 && <ul className="day-scheduled-items">
            {scheduled.map((task) => <li key={task.id}><ActivityCheck activity={task} checked={week.checked.includes(task.id)} onToggle={() => onToggle(task.id)} /><button type="button" className="activity-remove" onClick={() => onUnschedule(task.id)} aria-label={`Remove ${task.title} from ${dayNames[day]}`}>×</button></li>)}
          </ul>}
        </div>
      </div>
    </>
  );
}
