import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "../site-chrome";
import "./frameworks.css";

export default function FrameworksLayout({ children }: { children: ReactNode }) {
  return <><SiteHeader section="frameworks" /><main id="main">{children}</main><SiteFooter /></>;
}
