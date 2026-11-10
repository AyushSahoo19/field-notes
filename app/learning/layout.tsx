import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "../site-chrome";

export default function LearningLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader section="learning" />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
