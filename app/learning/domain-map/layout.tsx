import type { ReactNode } from "react";
import { CareerNav } from "../career/hero";
import "../career/career.css";
import "./study-atlases.css";

export default function DomainMapLayout({ children }: { children: ReactNode }) {
  return <><CareerNav current="map" />{children}</>;
}
