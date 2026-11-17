// Same size as the real widgets, so nothing jumps when they load.

export function EditorSkeleton() {
  return (
    <div className="editor skeleton-editor" aria-busy="true" aria-label="Loading editor">
      <div className="toolbar">
        <span className="sk sk-tool" />
        <span className="sk sk-tool" />
        <span className="sk sk-tool" />
        <span className="sk sk-tool" />
      </div>
      <div className="editor-surface">
        <span className="sk sk-line w-40" />
        <span className="sk sk-line" />
        <span className="sk sk-line w-90" />
        <span className="sk sk-line w-70" />
      </div>
    </div>
  );
}

export function ChartsSkeleton() {
  return (
    <div className="charts" aria-busy="true" aria-label="Loading charts">
      <div className="chart-card">
        <span className="sk sk-line w-40" />
        <div className="chart-box sk" />
      </div>
      <div className="chart-card">
        <span className="sk sk-line w-40" />
        <div className="chart-box sk" />
      </div>
    </div>
  );
}
