export type Kpi = { label: string; value: string; change: string; up: boolean };
export type MonthPoint = { month: string; revenue: number; costs: number };
export type Category = { name: string; value: number };

export type Report = {
  title: string;
  period: string;
  kpis: Kpi[];
  revenue: MonthPoint[];
  categories: Category[];
  notesHtml: string;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Builds the report data. Deterministic, so every visitor sees the same numbers. */
export function buildReport(): Report {
  const revenue = MONTHS.map((month, i) => ({
    month,
    revenue: Math.round(42_000 + i * 3_100 + Math.sin(i * 1.3) * 5_500),
    costs: Math.round(30_000 + i * 1_400 + Math.cos(i * 0.9) * 3_200),
  }));

  return {
    title: "Quarterly business review",
    period: "Q3 2026",
    kpis: [
      { label: "Revenue", value: "$214,800", change: "+18.2%", up: true },
      { label: "Gross margin", value: "41.6%", change: "+2.4 pts", up: true },
      { label: "Active customers", value: "3,912", change: "+6.1%", up: true },
      { label: "Churn", value: "2.3%", change: "−0.4 pts", up: false },
    ],
    revenue,
    categories: [
      { name: "Payroll", value: 48_200 },
      { name: "Hosting", value: 16_900 },
      { name: "Marketing", value: 14_300 },
      { name: "Software", value: 9_800 },
      { name: "Office", value: 6_100 },
      { name: "Other", value: 4_400 },
    ],
    notesHtml: [
      "<h2>Highlights</h2>",
      "<p>Revenue grew <strong>18%</strong> quarter over quarter, led by the self-serve plan and two enterprise renewals that closed early. Gross margin improved as hosting costs flattened after the move to reserved capacity.</p>",
      "<ul><li>Self-serve signups up 24% after the new onboarding flow.</li><li>Two enterprise renewals closed three weeks ahead of plan.</li><li>Support response time down from 9 hours to 4.</li></ul>",
      "<h2>Risks</h2>",
      "<p>Churn improved but remains concentrated in the smallest accounts. Marketing spend rose faster than pipeline in September, so the <em>cost per qualified lead</em> needs review before Q4 budgets are set.</p>",
      "<h2>Next quarter</h2>",
      "<p>Focus on annual-plan conversion, finish the billing migration and hire two engineers for the platform team.</p>",
    ].join(""),
  };
}

/** Stands in for a database or API call made on the server. */
export async function getReport(): Promise<Report> {
  return buildReport();
}
