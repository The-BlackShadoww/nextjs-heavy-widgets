import Link from "next/link";
import results from "@/docs/results.json";

type Result = {
  run: string;
  mode: "before" | "after";
  initialJsKb: number;
  afterScrollJsKb: number;
  afterEditJsKb: number;
  blockingMs: number;
  lcpMs: number;
};

function row(label: string, pick: (r: Result) => number, unit: string, run: string) {
  const list = results.results as Result[];
  const before = list.find((r) => r.run === run && r.mode === "before");
  const after = list.find((r) => r.run === run && r.mode === "after");
  if (!before || !after) return null;
  return (
    <tr key={label + run}>
      <td>{label}</td>
      <td>
        {pick(before).toLocaleString("en-US")} {unit}
      </td>
      <td className="win">
        {pick(after).toLocaleString("en-US")} {unit}
      </td>
    </tr>
  );
}

export default function Overview() {
  return (
    <main className="page overview">
      <p className="eyebrow">Next.js performance case study</p>
      <h1>A page with a rich text editor and charts, and a bundle that was too big</h1>
      <p className="lede">
        The same report page built twice. Before, the whole page is a client component. After, it is a server component
        that loads the editor and the charting library only when they are needed. Same content, same features.
      </p>

      <div className="cards">
        <Link href="/before/" className="card">
          <h2>Before</h2>
          <p>
            <code>&quot;use client&quot;</code> on the page. The editor, the charts, the data code and every component
            ship in the first download.
          </p>
          <span className="go">Open the Before page →</span>
        </Link>
        <Link href="/after/" className="card">
          <h2>After</h2>
          <p>
            A server component. The notes render as HTML on the server; the editor loads when you click Edit, the
            charts when you scroll to them.
          </p>
          <span className="go">Open the After page →</span>
        </Link>
      </div>

      <section className="section">
        <h2 className="section-title">Results</h2>
        <table className="results">
          <thead>
            <tr>
              <th>Measured on page load</th>
              <th>Before</th>
              <th>After</th>
            </tr>
          </thead>
          <tbody>
            {row("JavaScript downloaded (gzip)", (r) => r.initialJsKb, "KB", "No throttling")}
            {row("Main-thread blocking, 4× slower CPU", (r) => r.blockingMs, "ms", "4× CPU slowdown")}
            {row("Largest contentful paint, 4× slower CPU", (r) => r.lcpMs, "ms", "4× CPU slowdown")}
            {row("JavaScript after scrolling to the charts", (r) => r.afterScrollJsKb, "KB", "No throttling")}
            {row("JavaScript after opening the editor", (r) => r.afterEditJsKb, "KB", "No throttling")}
          </tbody>
        </table>
        <p className="note">
          Measured in Chromium by <code>scripts/measure.mjs</code> against the production build, served with gzip. The
          After page downloads the editor and charts only when the user needs them, and only the parts the page uses.
        </p>
      </section>

      <section className="section">
        <h2 className="section-title">What changed</h2>
        <div className="split">
          <div>
            <h3>Server components</h3>
            <p>
              Layout, headings, KPIs, the notes text and the data fetching. They render to HTML and ship no JavaScript.
              The data the widgets need is passed down as props.
            </p>
          </div>
          <div>
            <h3>Client components</h3>
            <p>
              Only two small slots: one for the editor, one for the charts. <code>&quot;use client&quot;</code> sits on
              those, not on the page.
            </p>
          </div>
          <div>
            <h3>Loading the heavy parts</h3>
            <ul>
              <li>
                <code>next/dynamic</code> with <code>ssr: false</code>, each in its own chunk.
              </li>
              <li>Editor loads on hover, focus or click; charts when scrolled near.</li>
              <li>Same-size skeletons, so nothing jumps.</li>
              <li>Only the 8 editor extensions the page uses, not the full StarterKit.</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="footer">
        Built by <a href="https://ashikurrahman.vercel.app">Ashikur Rahman</a> ·{" "}
        <a href="https://github.com/The-BlackShadoww/nextjs-heavy-widgets">Source on GitHub</a> · Companion to{" "}
        <a href="https://the-blackshadoww.github.io/table-filter-perf/">the 5,000-row table demo</a>
      </footer>
    </main>
  );
}
