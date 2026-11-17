import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { title: "Before: everything client-side" };

export default function BeforeLayout({ children }: { children: ReactNode }) {
  return children;
}
