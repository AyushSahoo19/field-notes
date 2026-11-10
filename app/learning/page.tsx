import type { Metadata } from "next";
import { families } from "./career/catalog";
import { PathExplorer } from "./career/explorer";
import { CareerNav } from "./career/hero";
import { pathCards } from "./career/path-cards";
import "./career/career.css";

export const metadata: Metadata = {
  title: "Career Learning Atlas · Field Notes",
  description: "Find learning paths from the High Paying Career Roles collection by career family, subject, skill, or target role.",
};

export default function LearningHome() {
  return (
    <>
      <CareerNav current="paths" />
      <section className="notebook-section paper career-atlas-section" id="path-catalog" aria-labelledby="path-catalog-title">
        <div className="wrap">
          <header className="career-atlas-heading">
            <p className="eyebrow">CAREER ATLAS / ALL PATHS</p>
            <h1 id="path-catalog-title">Career Learning Atlas<span>.</span></h1>
            <p>Browse the High Paying Career Roles collection by career family or search for a subject, skill, or target role.</p>
          </header>
          <PathExplorer cards={pathCards} families={families} view="cards" />
        </div>
      </section>
    </>
  );
}
