// AFTER: a server component. The layout, KPIs, the notes text and the data
// fetching run on the server and ship no JavaScript. Only two small client
// "slots" ship to the browser, and they load the heavy editor and charting
// library on demand, each in its own chunk.

import type { Metadata } from "next";
import { ChartsSlot } from "@/components/after/ChartsSlot";
import { EditorSlot } from "@/components/after/EditorSlot";
import { DemoNav, Kpis, ReportHeader, Section } from "@/components/ReportParts";
import { getReport } from "@/lib/report";

export const metadata: Metadata = { title: "After: server components + lazy widgets" };

export default async function AfterPage() {
  const report = await getReport();

  return (
    <main className="page">
      <DemoNav current="after" />
      <ReportHeader title={report.title} period={report.period} />
      <Kpis kpis={report.kpis} />
      <Section title="Notes">
        <EditorSlot content={report.notesHtml}>
          {/* Rendered on the server: readable instantly, no editor code needed. */}
          <div dangerouslySetInnerHTML={{ __html: report.notesHtml }} />
        </EditorSlot>
      </Section>
      <Section title="Charts" id="charts">
        <ChartsSlot revenue={report.revenue} categories={report.categories} />
      </Section>
    </main>
  );
}
