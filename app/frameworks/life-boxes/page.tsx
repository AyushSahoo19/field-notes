import { sitePath } from "../../../lib/site-path";
import type { Metadata } from "next";
import { ExternalLink } from "../../site-chrome";
import { LifePlanner } from "./planner";

export const metadata: Metadata = {
  title: "My 8 Life Boxes · Frameworks · Field Notes",
  description: "An interactive activity map, daily plan, and weekly review for the eight life boxes.",
};

export default function LifeBoxes() {
  return (
    <>
      <section className="paper life-hero" aria-labelledby="life-title">
        <div className="wrap life-hero-inner">
          <div>
            <a className="framework-breadcrumb" href={sitePath("/frameworks")}><span aria-hidden="true">←</span> All frameworks</a>
            <p className="eyebrow"><span className="eyebrow-rule" /> FRAMEWORK 01 / TIME & ACTIVITIES</p>
            <h1 id="life-title">My 8 Life Boxes<span>.</span></h1>
            <p>Pick a box, plan your day, and review the week.</p>
          </div>
          <ExternalLink className="framework-print" href="https://chatgpt.com/library?file_id=libfile_4857b7a765b88191a952f1b695f538e7&account_id=personal">Open printable planner</ExternalLink>
        </div>
      </section>
      <section className="paper life-workspace" aria-label="Life Boxes planner">
        <div className="wrap"><LifePlanner /></div>
      </section>
    </>
  );
}
