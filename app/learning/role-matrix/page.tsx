import type { Metadata } from "next";
import { families } from "../career/catalog";
import { PathExplorer } from "../career/explorer";
import { CareerNav } from "../career/hero";
import { pathCards } from "../career/path-cards";
import "../career/career.css";

export const metadata: Metadata = {
  title: "Career Role Matrix · Field Notes",
  description: "Filter career roles and compare subjects and prerequisites across learning paths.",
};

export default function RoleMatrixPage() {
  return (
    <>
      <CareerNav current="roles" />
      <section className="notebook-section paper career-atlas-section" aria-labelledby="role-matrix-title">
        <div className="wrap">
          <header className="career-atlas-heading">
            <p className="eyebrow">CAREER ATLAS / ROLE COMPARISON</p>
            <h1 id="role-matrix-title">Career role matrix<span>.</span></h1>
            <p>Filter the chart by career family, then select up to three paths to compare their roles, prerequisites, and subjects.</p>
          </header>
          <PathExplorer cards={pathCards} families={families} view="matrix" />
        </div>
      </section>
    </>
  );
}
