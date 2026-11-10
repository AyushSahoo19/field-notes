import { sitePath } from "../lib/site-path";
import { MonteCarlo, SignalMonitor } from "./experiments";
import { atlas, ExternalLink, github, Icon, precisionLab, SiteFooter, SiteHeader } from "./site-chrome";

function AtlasArt() {
  return (
    <svg className="project-art atlas-art" viewBox="0 0 480 170" aria-hidden="true">
      <g fill="none" stroke="#aebdf3" strokeWidth="1.4">
        <path d="M109 86C144 86 147 46 183 46h40m-114 40h114m-114 0c35 0 38 40 74 40h40M296 46h25c35 0 35 40 70 40m-95 0h95m-95 40h25c35 0 35-40 70-40"/>
      </g>
      <g fill="#eff2ff" stroke="#a6b5ed">
        <rect x="44" y="70" width="83" height="32" rx="6"/>
        <rect x="207" y="30" width="106" height="32" rx="6"/>
        <rect x="207" y="70" width="106" height="32" rx="6" fill="#c6d1fa" stroke="#8499e7"/>
        <rect x="207" y="110" width="106" height="32" rx="6"/>
        <rect x="378" y="70" width="57" height="32" rx="6" fill="#172652" stroke="#172652"/>
      </g>
      <g className="art-type" textAnchor="middle" fill="#253873">
        <text x="85" y="90">MATH</text><text x="260" y="50">OPTIMIZATION</text>
        <text x="260" y="90">ATTENTION</text><text x="260" y="130">EVALUATION</text>
        <text x="406" y="90" fill="#e4ebff">AI</text>
      </g>
    </svg>
  );
}

function PrecisionArt() {
  return (
    <svg className="project-art precision-art" viewBox="0 0 480 170" aria-hidden="true">
      <g fill="none" stroke="#a8bdb6">
        <path d="M52 110H428M63 105v10m25-8v6m25-6v6m25-6v6m25-8v10m25-8v6m25-6v6m25-6v6m25-8v10m25-8v6m25-6v6m25-6v6m25-8v10m25-8v6m25-6v6"/>
        <path d="M163 110V60h25m75 50V60h-25m125 50V60h-25" strokeDasharray="3 4"/>
      </g>
      <g className="art-type" textAnchor="middle" fill="#335a50">
        <text x="238" y="52" style={{ fontSize: 15 }}>FLOAT64 · 0.1 + 0.2 ≠ 0.3</text>
        <text x="63" y="139">INPUT</text><text x="263" y="139">ROUNDING</text><text x="405" y="139">CHECK</text>
      </g>
      <circle cx="163" cy="110" r="4" fill="#447d6d"/><circle cx="263" cy="110" r="4" fill="#447d6d"/><circle cx="363" cy="110" r="4" fill="#447d6d"/>
    </svg>
  );
}

const pipeline = [
  { name: "Sense", detail: "Suspension pressure + GPS", icon: "pulse" },
  { name: "Process", detail: "Python event matching", icon: "code" },
  { name: "Map", detail: "Locations for inspection", icon: "pin" },
] as const;

export default function Home() {
  return (
    <>
      <SiteHeader section="home" />

      <main id="main">
        <section className="hero" aria-labelledby="intro">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="eyebrow"><span className="eyebrow-rule"/> ENGINEERING PORTFOLIO</p>
              <h1 id="intro">Finding<br className="hero-break"/> the <em>signal.</em></h1>
              <p className="hero-description">I’m Ayush. I build tools that make complex systems easier to see and understand, from haul-road telemetry to interactive maps of AI.</p>
              <div className="hero-actions">
                <a className="button primary" href="#work">Explore my work <Icon name="down" /></a>
                <a className="quiet-link" href="#lab">Try the lab <Icon name="arrow" /></a>
              </div>
            </div>
            <div className="hero-figure">
              <SignalMonitor />
              <p className="figure-caption"><span>FIG. 01</span> A pressure event becomes a point on a map.</p>
            </div>
          </div>
          <div className="wrap hero-index">
            <span>FIELD NOTES <b>/</b> AYUSH KUMAR SAHOO</span>
            <span>FIELD ENGINEERING <b>·</b> AI SYSTEMS <b>·</b> APPLIED MATH</span>
          </div>
        </section>

        <section className="work paper" id="work" aria-labelledby="work-title">
          <div className="wrap">
            <div className="section-heading">
              <div>
                <p className="eyebrow"><span className="section-number">01 /</span> PORTFOLIO</p>
                <h2 id="work-title">Selected work<span className="period">.</span></h2>
              </div>
              <p>Projects that turn sensor data, technical concepts, and calculations into something you can inspect.</p>
            </div>

            <article className="feature" aria-labelledby="road-title">
              <div className="feature-copy">
                <p className="eyebrow project-meta"><span>01</span> FIELD ENGINEERING <span>·</span> TEAM PROJECT</p>
                <h3 id="road-title">Haul-road<br/> intelligence</h3>
                <p>Our team paired mining-truck suspension readings with GPS to flag stretches of haul road for inspection. The result was a map that helped maintenance teams decide where to look first.</p>
                <details className="case-details" id="haul-road-case">
                  <summary><span>Read the case study</span><span className="plus" aria-hidden="true"/></summary>
                  <div className="case-body">
                    <h4>The problem</h4>
                    <p>A rough section can be hard to spot from a single drive. Suspension pressure gives a second way to notice where the truck reacted to the road.</p>
                    <h4>From the truck to the map</h4>
                    <p>The workflow collected pressure readings from the suspension cylinders and GPS from the truck. Python matched pressure events to positions so that a map could surface locations worth checking.</p>
                    <h4>How to interpret the signal</h4>
                    <p>Load, speed, and braking can also affect pressure. A hotspot is a candidate for inspection. Field checks help determine what caused it.</p>
                  </div>
                </details>
              </div>
              <div className="pipeline">
                <p className="eyebrow pipeline-label"><span className="dot"/> PROJECT WORKFLOW</p>
                <ol>
                  {pipeline.map((step, i) => (
                    <li key={step.name}>
                      <div className="pipe-icon"><Icon name={step.icon} /></div>
                      <div><span className="pipe-name">{step.name}</span><span className="pipe-detail">{step.detail}</span></div>
                      <span className="pipe-index">0{i + 1}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </article>

            <div className="project-grid">
              <article className="project" aria-labelledby="atlas-title">
                <div className="art-panel art-atlas"><AtlasArt /></div>
                <div className="project-copy">
                  <p className="eyebrow project-meta"><span>02</span> AI SYSTEMS <span>·</span> LEARNING TOOL</p>
                  <h3 id="atlas-title">AI Mastery Atlas</h3>
                  <p>A study map for AI, machine learning, deep learning, and agents, with topic definitions, resources, and learning paths.</p>
                  <ExternalLink className="text-link" href={atlas}>Open the Atlas</ExternalLink>
                  <span className="link-note">Site access required</span>
                </div>
              </article>
              <article className="project" aria-labelledby="precision-title">
                <div className="art-panel art-precision"><PrecisionArt /></div>
                <div className="project-copy">
                  <p className="eyebrow project-meta"><span>03</span> APPLIED MATH <span>·</span> OPEN SOURCE</p>
                  <h3 id="precision-title">Numerical Precision Lab</h3>
                  <p>A set of Python experiments and tests for checking small numerical results, tracing rounding error, and reproducing a calculation.</p>
                  <ExternalLink className="text-link" href={precisionLab}>View the repository</ExternalLink>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="paper chapter-gateway" aria-label="More from Field Notes">
          <div className="wrap gateway-grid">
            <a className="gateway-card" href={sitePath("/learning")}>
              <span className="eyebrow">THE LEARNING NOTEBOOK</span>
              <strong>Career Learning Atlas</strong>
              <span>Career paths, study roadmaps, and experiments.</span>
              <span className="gateway-arrow"><Icon name="arrow" /></span>
            </a>
            <a className="gateway-card" href={sitePath("/projects")}>
              <span className="eyebrow">THE PROJECT STUDIO</span>
              <strong>Avenra AI &amp; other builds</strong>
              <span>Explore projects, concepts, and prototypes.</span>
              <span className="gateway-arrow"><Icon name="arrow" /></span>
            </a>
            <a className="gateway-card" href={sitePath("/frameworks")}>
              <span className="eyebrow">FRAMEWORKS</span>
              <strong>My 8 Life Boxes</strong>
              <span>Plan activities, budget time, and review the week.</span>
              <span className="gateway-arrow"><Icon name="arrow" /></span>
            </a>
          </div>
        </section>

        <section className="lab" id="lab" aria-labelledby="lab-title">
          <div className="wrap">
            <div className="section-heading lab-heading">
              <div>
                <p className="eyebrow"><span className="section-number">02 /</span> INTERACTIVE NOTEBOOK</p>
                <h2 id="lab-title">Randomness<br/> but <em>Relevant.</em></h2>
              </div>
              <p>An experiment in the spirit of my storytelling series. See what random samples can tell you about a shape whose area we already know.</p>
            </div>
            <MonteCarlo />
          </div>
        </section>

        <section className="about paper" id="about" aria-labelledby="about-title">
          <div className="wrap about-grid">
            <div>
              <p className="eyebrow"><span className="section-number">03 /</span> ABOUT</p>
              <h2 id="about-title">Hi, I’m Ayush<span className="period">.</span></h2>
            </div>
            <div className="about-copy">
              <p>I work on engineering problems in mining and study how software, mathematics, and AI can help explain what’s happening inside a system. I enjoy tracing an idea from its first principles to a diagram, a working tool, or an experiment someone else can run.</p>
              <p>I’m currently exploring how AI models reason and use tools, and how to explain those mechanisms visually.</p>
              <ExternalLink href={github} className="text-link">Find me on GitHub</ExternalLink>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
