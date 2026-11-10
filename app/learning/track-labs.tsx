"use client";

import { useState, type ReactNode } from "react";

function Demo({ label, title, description, children }: { label: string; title: string; description: string; children: ReactNode }) {
  return (
    <div className="demo-grid">
      <div className="demo-intro">
        <p className="eyebrow"><span className="eyebrow-rule" /> 01 / {label}</p>
        <h2 id="demo-title">{title}</h2>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}

const attentionTokens = [
  { token: "engineer", logit: 0.75 },
  { token: "checked", logit: 0.35 },
  { token: "sensor", logit: 2.5 },
  { token: "before", logit: -0.25 },
  { token: "it", logit: 0.55 },
];

const maxAttentionLogit = Math.max(...attentionTokens.map(({ logit }) => logit));

export function AttentionLab() {
  const [temperature, setTemperature] = useState(1);
  const exps = attentionTokens.map(({ logit }) => Math.exp((logit - maxAttentionLogit) / temperature));
  const total = exps.reduce((sum, weight) => sum + weight, 0);
  const weights = exps.map((value) => value / total);
  return (
    <Demo label="INTERACTIVE LAB" title="Where does attention go?" description="In this toy example, the word “it” assigns a weight to each candidate token. Lower the temperature to concentrate weight on the highest score. Raise it to spread weight across more tokens.">
      <div className="notebook-panel demo-panel">
        <p className="panel-meta"><span className="dot" /> ONE QUERY · SYNTHETIC SCORES</p>
        <p className="demo-context">The engineer checked the sensor before <strong>it</strong> failed.</p>
        <label className="range-label" htmlFor="temperature">Softmax temperature <output htmlFor="temperature">{temperature.toFixed(1)}</output></label>
        <input className="chapter-range" id="temperature" type="range" min=".3" max="3" step=".1" value={temperature} onChange={(event) => setTemperature(Number(event.target.value))} />
        <div className="range-endpoints"><span>0.3 · more concentrated</span><span>3.0 · more spread</span></div>
        <ul className="weight-list" aria-label="Attention weights">
          {attentionTokens.map(({ token, logit }, i) => (
            <li key={token}>
              <span title={`Score ${logit}`}>{token}</span>
              <span className="weight-track" aria-hidden="true"><span style={{ width: `${weights[i] * 100}%` }} /></span>
              <span>{(weights[i] * 100).toFixed(1)}%</span>
            </li>
          ))}
        </ul>
        <p className="demo-footnote">Softmax maps scores to weights that sum to one. This diagram uses invented scores to isolate the effect of temperature.</p>
      </div>
    </Demo>
  );
}

const monthlyReturns = [.025, -.014, .019, .01, -.021, .031, .017, -.012, .025, -.008, .015, .02];
const initialBalance = 100000;
const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

function balances(costBps: number) {
  let balance = initialBalance;
  return [balance, ...monthlyReturns.map((monthReturn) => {
    balance *= (1 + monthReturn) * (1 - costBps / 10000);
    return balance;
  })];
}

const gross = balances(0);
const chartWidth = 390;
const chartHeight = 122;

export function CostLab() {
  const [cost, setCost] = useState(25);
  const net = balances(cost);
  const low = Math.floor(Math.min(...net, ...gross) / 5000) * 5000 - 2500;
  const high = Math.ceil(Math.max(...net, ...gross) / 5000) * 5000 + 2500;
  const pointY = (value: number) => 16 + chartHeight * (high - value) / (high - low);
  const pointX = (index: number) => 57 + index * chartWidth / monthlyReturns.length;
  const path = (values: number[]) => values.map((value, i) => `${pointX(i)},${pointY(value)}`).join(" ");
  const grossEnd = gross[gross.length - 1];
  const netEnd = net[net.length - 1];

  return (
    <Demo label="INTERACTIVE LAB" title="What do trading costs change?" description="Both lines start with ₹1 lakh and follow the same invented monthly returns. Adjust the cost to see the difference a recurring charge makes over twelve months.">
      <div className="notebook-panel demo-panel">
        <p className="panel-meta"><span className="dot" /> COST SIMULATOR · NO MARKET DATA</p>
        <label className="range-label" htmlFor="trading-cost">Cost per monthly rebalance <output htmlFor="trading-cost">{cost} bps</output></label>
        <input className="chapter-range" id="trading-cost" type="range" min="0" max="100" step="5" value={cost} onChange={(event) => setCost(Number(event.target.value))} />
        <div className="range-endpoints"><span>0 bps</span><span>100 bps = 1%</span></div>
        <svg className="cost-chart" viewBox="0 0 468 164" role="img" aria-label={`Gross balance ends at ${currency.format(grossEnd)} and net balance at ${currency.format(netEnd)} after twelve months.`}>
          {[high - 2500, (high + low) / 2, low + 2500].map((tick) => (
            <g key={tick}>
              <line x1="57" x2="447" y1={pointY(tick)} y2={pointY(tick)} stroke="#495049" strokeDasharray="3 4"/>
              <text x="48" y={pointY(tick) + 4} textAnchor="end" className="cost-tick">{tick / 1000}k</text>
            </g>
          ))}
          <polyline points={path(gross)} fill="none" stroke="#c8d2e6" strokeWidth="2" strokeLinejoin="round" strokeDasharray="5 4"/>
          <polyline points={path(net)} fill="none" stroke="#b5e7cc" strokeWidth="2.4" strokeLinejoin="round"/>
          <circle cx="447" cy={pointY(netEnd)} r="3.5" fill="#b5e7cc" />
          <text x="57" y="157" className="cost-tick">START</text>
          <text x="447" y="157" textAnchor="end" className="cost-tick">MONTH 12</text>
        </svg>
        <dl className="demo-results">
          <div><dt><span className="legend-line gross-line" /> Gross ending</dt><dd>{currency.format(grossEnd)}</dd></div>
          <div><dt><span className="legend-line" /> Net ending</dt><dd>{currency.format(netEnd)}</dd></div>
          <div><dt>Difference</dt><dd>{currency.format(grossEnd - netEnd)}</dd></div>
        </dl>
        <p className="demo-footnote">The model applies the cost to the full balance after each month’s return and assumes no deposits or withdrawals.</p>
      </div>
    </Demo>
  );
}

const assumptions = [
  { label: "Pain", question: "Is this problem recurring?", test: "Ask three teams to walk through their last cloud cost spike. Record how long it took to find the cause and what they did next.", evidence: "Teams describe the same slow step using recent examples." },
  { label: "Buyer", question: "Who can approve a pilot?", test: "Ask the person who handles cloud alerts to draw the approval path. Ask the budget owner what a trial would have to show.", evidence: "A named sponsor can authorize the test and define a useful outcome." },
  { label: "Data", question: "Can the team share the inputs?", test: "Sketch the minimum fields needed to explain a cost spike. Try a sample export with anonymized service and cost data.", evidence: "The pilot can run using data the team is comfortable sharing." },
  { label: "Payment", question: "Would anyone pay for the result?", test: "Show a time-boxed pilot offer with a price, one deliverable, and a proposed start date.", evidence: "The sponsor is willing to discuss budget and schedule for the proposed scope." },
];

export function PilotLab() {
  const [active, setActive] = useState(0);
  const item = assumptions[active];
  return (
    <Demo label="INTERACTIVE LAB" title="What should the first pilot prove?" description="Imagine a tool that helps a finance or platform team investigate a surprise cloud bill. Select an assumption to see what you could test before building it.">
      <div className="notebook-panel demo-panel">
        <p className="panel-meta"><span className="dot" /> ASSUMPTION MAP · HYPOTHETICAL FINOPS PILOT</p>
        <div className="assumption-map" role="group" aria-label="Pilot assumptions">
          {assumptions.map(({ label }, index) => (
            <button type="button" aria-pressed={index === active} key={label} onClick={() => setActive(index)}>
              <span>0{index + 1}</span>{label}
            </button>
          ))}
        </div>
        <div className="assumption-detail" aria-live="polite">
          <h3>{item.question}</h3>
          <p>{item.test}</p>
          <p className="evidence"><strong>Evidence to look for</strong>{item.evidence}</p>
        </div>
      </div>
    </Demo>
  );
}
