import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Field Notes · Ayush Kumar Sahoo",
  description: "An engineering portfolio and interactive notebook on industrial sensing, AI systems, and applied mathematics.",
  icons: { icon: `${process.env.NEXT_PUBLIC_PAGES_BASE ?? ""}/favicon.svg` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
