"use client";

import { useMemo, useState } from "react";

const trace = [
  29, 25, 26, 31, 24, 27, 22, 31, 34, 28, 27, 34, 29, 25, 32, 36, 45, 34,
  29, 30, 24, 28, 34, 24, 31, 26, 32, 30, 34, 28, 25, 32, 25, 33, 27, 33,
  43, 68, 49, 31, 35, 26, 29, 35, 29, 36, 34, 27, 30, 36, 29, 35, 30, 32,
  35, 56, 91, 65, 42, 51, 38, 34, 26, 32, 30, 33, 24, 35, 26, 34, 28, 31,
];

const events = [
  { id: "A", label: "Baseline", sample: 16, x: 139, y: 219, color: "#93b4ff" },
  { id: "B", label: "Elevated", sample: 37, x: 254, y: 206, color: "#f1c784" },
  { id: "C", label: "Hotspot", sample: 56, x: 371, y: 214, color: "#ff927d" },
] as const;

const plotX = (index: number) => 40 + index * (422 / (trace.length - 1));
const plotY = (value: number) => 121 - value * 0.9;
const tracePath = trace.map((value, index) => [plotX(index), plotY(value)].join(",")).join(" ");

const terrain = [
  "M19 277C87 253 54 210 119 182c58-24 84 0 115-31m-192 130c79-29 50-64 93-82 58-25 96-2 126-48m-190 130c54-16 50-52 91-65 39-12 93-2 125-65",
  "M99 281c32-18 57-44 98-43 43 1 82-35 112-87m-178 130c25-17 49-27 78-26 41 1 90-46 125-104m-176 130c30-9 67-1 96-20 34-22 84-72 101-110",
  "M212 281c36-6 51-13 70-29 41-36 73-75 90-101m-123 130c38-11 55-25 82-51 29-28 46-62 61-79m-107 130c28-10 59-33 79-54 24-26 36-57 52-76",
  "M335 281c29-15 46-24 71-56 21-28 33-34 72-36m-112 92c37-13 50-36 69-52 15-12 24-15 43-15m-85 67c35-8 52-44 85-44m-47 44c13-11 27-21 47-22",
];
const route = "M42 247C72 247 104 250 124 230Q131 223 139 219C172 199 196 235 224 223Q241 216 254 206C271 193 287 173 309 176C338 180 340 215 371 214C410 213 419 178 461 183";

export function SignalMonitor() {
  const [active, setActive] = useState(2);
  const event = events[active];
  const pressure = trace[event.sample];
  const activeX = plotX(event.sample);
  const activeY = plotY(pressure);

  return (
    <div className="monitor">
      <div className="monitor-head">
        <div><p className="monitor-kicker"><span className="dot"/> SIGNAL MONITOR</p><h2>Haul-road telemetry</h2></div>
        <span className="demo-badge">DEMO DATA</span>
      </div>
      <svg className="monitor-svg" viewBox="0 0 500 292" role="img" aria-label={`Illustrative pressure trace and route. Event ${event.id}, ${event.label}, is selected with pressure index ${pressure} out of 100.`}>
        <defs>
          <pattern id="plot-grid" width="24" height="22" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V22" fill="none" stroke="#26354b" strokeWidth="1"/>
          </pattern>
          <linearGradient id="trace-fill" x1="0" x2="0" y1="0" y2="1" gradientUnits="objectBoundingBox">
            <stop stopColor="#7399f3" stopOpacity=".28"/><stop offset="1" stopColor="#7399f3" stopOpacity="0"/>
          </linearGradient>
          <clipPath id="map-frame"><rect x="20" y="153" width="460" height="124" rx="5"/></clipPath>
        </defs>
        <rect x="20" y="24" width="460" height="103" rx="5" fill="#121d2f" stroke="#2a3952"/>
        <rect x="21" y="25" width="458" height="100" rx="5" fill="url(#plot-grid)"/>
        <g className="svg-type" fill="#9badc9">
          <text x="20" y="13">SUSPENSION PRESSURE INDEX</text>
          <text x="480" y="13" textAnchor="end">0–100</text>
          <text x="29" y="117">0</text>
          <text x="20" y="144">ROUTE MAP</text>
          <text x="480" y="144" textAnchor="end">ILLUSTRATIVE</text>
        </g>
        <path d={`M40 121 L${tracePath.replaceAll(" ", " L")} L462 121 Z`} fill="url(#trace-fill)" />
        <polyline points={tracePath} fill="none" stroke="#93b4ff" strokeWidth="1.9" strokeLinejoin="round" />
        <line x1={activeX} y1="25" x2={activeX} y2="126" stroke={event.color} strokeOpacity=".66" strokeDasharray="3 4"/>
        <circle cx={activeX} cy={activeY} r="9" fill={event.color} fillOpacity=".15"/>
        <circle cx={activeX} cy={activeY} r="3.8" fill={event.color} stroke="#131d2f" strokeWidth="1.3"/>
        <text x={activeX - 8} y={Math.max(activeY - 8, 38)} textAnchor="end" fill={event.color} className="svg-type">{pressure}</text>

        <rect x="20" y="153" width="460" height="124" rx="5" fill="#141f33" stroke="#2a3952"/>
        <g clipPath="url(#map-frame)">
          <rect x="21" y="154" width="458" height="122" fill="url(#plot-grid)" opacity=".62"/>
          <g fill="none" stroke="#3f5271" strokeWidth=".9" opacity=".75">
            {terrain.map((line) => <path key={line} d={line} />)}
          </g>
          <path d={route} fill="none" stroke="#91b4ff" strokeOpacity=".14" strokeWidth="10" strokeLinecap="round"/>
          <path d={route} fill="none" stroke="#8ca9e8" strokeWidth="2" strokeLinecap="round"/>
          <g fill="#9badc9" className="svg-type">
            <text x="34" y="172">N ↑</text><text x="35" y="267">START</text><text x="463" y="267" textAnchor="end">END</text>
          </g>
          {events.map((marker) => (
            <g key={marker.id}>
              {marker.id === event.id && <circle cx={marker.x} cy={marker.y} r="15" fill={marker.color} fillOpacity=".13" stroke={marker.color} strokeOpacity=".48" />}
              <circle cx={marker.x} cy={marker.y} r={marker.id === event.id ? 5 : 4} fill={marker.color} stroke="#101827" strokeWidth="1.4" />
              <text x={marker.x} y={marker.y - 20} textAnchor="middle" fill={marker.color} className="svg-type">{marker.id}</text>
            </g>
          ))}
        </g>
      </svg>
      <div className="monitor-controls" role="group" aria-label="Select a pressure event">
        {events.map((choice, index) => (
          <button key={choice.id} type="button" aria-label={`${choice.id} ${choice.label}`} aria-pressed={active === index} onClick={() => setActive(index)}>
            <span className="event-dot" style={{ backgroundColor: choice.color }} /><span>{choice.id} <span className="event-name">{choice.label}</span></span>
          </button>
        ))}
      </div>
    </div>
  );
}

const sampleSizes = [100, 500, 2000];
const plotSize = 250;

function sampleSquare(seed: number, count: number) {
  let state = seed;
  const random = () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };

  const inside: string[] = [];
  const outside: string[] = [];
  for (let index = 0; index < count; index += 1) {
    const x = random();
    const y = random();
    const points = x * x + y * y <= 1 ? inside : outside;
    points.push(`M${(x * plotSize).toFixed(1)} ${(plotSize - y * plotSize).toFixed(1)}h.01`);
  }
  return { inside: inside.join(""), outside: outside.join(""), hits: inside.length };
}

export function MonteCarlo() {
  const [sampleCount, setSampleCount] = useState(500);
  const [seed, setSeed] = useState(27931);
  const samples = useMemo(() => sampleSquare(seed, sampleCount), [seed, sampleCount]);
  const estimate = 4 * samples.hits / sampleCount;

  return (
    <article className="experiment" aria-labelledby="experiment-title">
      <div className="experiment-copy">
        <p className="eyebrow experiment-kicker"><span className="dot"/> EXPERIMENT 01 <span> / </span> MONTE CARLO</p>
        <h3 id="experiment-title">Estimate π with random points</h3>
        <p>Scatter points uniformly in a square. The quarter circle occupies π/4 of its area. Count the blue points inside the curve and multiply their fraction by four.</p>

        <div className="sample-options" role="group" aria-label="Number of sample points">
          <span>Samples</span>
          {sampleSizes.map((size) => (
            <button type="button" key={size} aria-pressed={size === sampleCount} onClick={() => setSampleCount(size)}>{size.toLocaleString("en-IN")}</button>
          ))}
        </div>

        <dl className="results" aria-live="polite" aria-atomic="true">
          <div><dt>π estimate</dt><dd>{estimate.toFixed(4)}</dd></div>
          <div><dt>Inside circle</dt><dd>{samples.hits.toLocaleString("en-IN")} <span>/ {sampleCount.toLocaleString("en-IN")}</span></dd></div>
          <div><dt>Absolute error</dt><dd>{Math.abs(estimate - Math.PI).toFixed(4)}</dd></div>
        </dl>

        <div className="experiment-actions">
          <button className="button outline" type="button" onClick={() => setSeed((value) => value + 1)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M13.5 6A5.75 5.75 0 1 0 14 9M13.5 2.5V6H10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Resample
          </button>
          <a href="https://dept.stat.lsa.umich.edu/~kshedden/introds/topics/standard_errors/" target="_blank" rel="noreferrer">Why sample size matters</a>
        </div>
      </div>

      <figure className="sample-figure">
        <svg viewBox="-23 -12 289 288" role="img" aria-label={`Scatter plot with ${sampleCount} points, including ${samples.hits} inside the quarter circle.`}>
          <rect width={plotSize} height={plotSize} fill="#131e30" stroke="#44516d"/>
          <path d="M0 0A250 250 0 0 1 250 250H0Z" fill="#1d2c49"/>
          <g stroke="#30425d" strokeWidth=".8">
            <path d="M50 0v250m50-250v250m50-250v250m50-250v250M0 50h250m-250 50h250m-250 50h250m-250 50h250"/>
          </g>
          <path d={samples.outside} stroke="#8d9bb2" strokeWidth={sampleCount > 1000 ? "1.8" : "3"} strokeLinecap="round" opacity=".72"/>
          <path d={samples.inside} stroke="#a4bdff" strokeWidth={sampleCount > 1000 ? "1.8" : "3"} strokeLinecap="round" opacity=".84"/>
          <path d="M0 0A250 250 0 0 1 250 250" fill="none" stroke="#b4c9ff" strokeWidth="1.7"/>
          <g className="svg-type" fill="#9badc9">
            <text x="-15" y="5">1</text><text x="-15" y="252">0</text>
            <text x="0" y="268">0</text><text x="246" y="268">1</text>
          </g>
        </svg>
        <figcaption><span><i/> Inside quarter circle</span><span><i/> Outside quarter circle</span></figcaption>
      </figure>
    </article>
  );
}
