"use client";

// BEFORE: "use client" on the whole page. The page, the data code, the full
// editor and the charting library all ship in the initial JavaScript and must
// download, parse and run before the page is interactive, even for visitors
// who never edit the notes or scroll to the charts.

import { useMemo } from "react";
import { Charts } from "@/components/charts/Charts";
import { FullEditor } from "@/components/editor/FullEditor";
import { DemoNav, Kpis, ReportHeader, Section } from "@/components/ReportParts";
import { buildReport } from "@/lib/report";

export default function BeforePage() {
  const report = useMemo(buildReport, []);

  return (
    <main className="page">
      <DemoNav current="before" />
      <ReportHeader title={report.title} period={report.period} />
      <Kpis kpis={report.kpis} />
      <Section title="Notes">
        <FullEditor content={report.notesHtml} />
      </Section>
      <Section title="Charts" id="charts">
        <Charts revenue={report.revenue} categories={report.categories} />
      </Section>
    </main>
  );
}
