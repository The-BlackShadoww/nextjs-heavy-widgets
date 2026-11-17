import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Heavy widgets in Next.js: server components and lazy loading",
    template: "%s · Heavy widgets in Next.js",
  },
  description:
    "A Next.js page with a rich text editor and charts, built twice: everything client-side, then server components with the editor and charts loaded on demand. Measured.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
