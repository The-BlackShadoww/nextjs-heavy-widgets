import Link from "next/link";
import type { ReactNode } from "react";
import type { Kpi } from "@/lib/report";

// Plain components with no hooks: the After page renders them on the server,
// the Before page ships them to the browser as part of its client bundle.

export function DemoNav({ current }: { current: "before" | "after" }) {
  return (
    <nav className="demo-nav" aria-label="Demo">
      <Link href="/" className="back">
        ← Overview
      </Link>
      <div className="switch">
        <Link href="/before/" className={current === "before" ? "active" : undefined} aria-current={current === "before" ? "page" : undefined}>
          Before: everything client-side
        </Link>
        <Link href="/after/" className={current === "after" ? "active" : undefined} aria-current={current === "after" ? "page" : undefined}>
          After: server components + lazy widgets
        </Link>
      </div>
    </nav>
  );
}

export function ReportHeader({ title, period }: { title: string; period: string }) {
  return (
    <header className="report-header">
      <p className="eyebrow">{period}</p>
      <h1>{title}</h1>
      <p className="lede">Numbers, notes and charts for the quarter. The notes are editable and the charts are interactive.</p>
    </header>
  );
}

export function Kpis({ kpis }: { kpis: Kpi[] }) {
  return (
    <dl className="kpis">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="kpi">
          <dt>{kpi.label}</dt>
          <dd className="kpi-value">{kpi.value}</dd>
          <dd className={kpi.up ? "kpi-change up" : "kpi-change down"}>{kpi.change}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Section({ title, id, children }: { title: string; id?: string; children: ReactNode }) {
  return (
    <section className="section" id={id}>
      <h2 className="section-title">{title}</h2>
      {children}
    </section>
  );
}
