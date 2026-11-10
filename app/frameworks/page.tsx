import { sitePath } from "../../lib/site-path";
import type { Metadata } from "next";
import { Icon } from "../site-chrome";
import { boxes } from "./life-boxes/life-data";
import { FrameworkShelf } from "./shelf";

export const metadata: Metadata = {
  title: "Frameworks · Field Notes",
  description: "Personal frameworks for learning, planning time, and finishing meaningful work.",
};

export default function Frameworks() {
  return (
    <>
      <section className="framework-hero" aria-labelledby="framework-title">
        <div className="wrap framework-hero-inner">
          <div>
            <p className="eyebrow"><span className="eyebrow-rule" /> FIELD NOTES / FRAMEWORKS</p>
            <h1 id="framework-title">Make time for<br /><em>what matters.</em></h1>
            <p>A home for the frameworks you use to learn, plan your time, and follow through. Start with the eight life boxes, or save a framework of your own.</p>
            <div className="hero-actions framework-actions">
              <a className="button primary" href={sitePath("/frameworks/life-boxes")}>Open Life Boxes <Icon name="arrow" /></a>
              <a className="quiet-link" href="#framework-library">Browse frameworks <Icon name="down" /></a>
            </div>
          </div>
          <div className="framework-blueprint" aria-label="Eight life boxes preview">
            <p className="panel-meta"><span className="dot" /> FRAMEWORK 01 / LIFE BOXES</p>
            <div className="blueprint-cells">
              {boxes.map((box, i) => <div className={`life-tone-${box.tone}`} key={box.id}><span>{String(i + 1).padStart(2, "0")}</span><strong>{box.short}</strong></div>)}
            </div>
          </div>
        </div>
      </section>
      <section id="framework-library" className="paper framework-library" aria-labelledby="framework-library-title">
        <div className="wrap">
          <FrameworkShelf />
        </div>
      </section>
    </>
  );
}
