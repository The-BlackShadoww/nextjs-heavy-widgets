"use client";

import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";
import { EditorSkeleton } from "../Skeletons";

// The editor is its own chunk, never rendered on the server (it needs window).
const LeanEditor = dynamic(() => import("../editor/LeanEditor").then((m) => m.LeanEditor), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

// Start downloading on intent (hover or keyboard focus), before the click.
let preloaded = false;
function preload() {
  if (preloaded) return;
  preloaded = true;
  void import("../editor/LeanEditor");
}

/**
 * Shows the notes as server-rendered HTML (passed in as children, so it costs
 * no JavaScript) and swaps in the real editor only when the user wants to edit.
 */
export function EditorSlot({ content, children }: { content: string; children: ReactNode }) {
  const [editing, setEditing] = useState(false);

  if (editing) return <LeanEditor content={content} />;

  return (
    <div className="editor" onPointerEnter={preload} onFocus={preload}>
      <div className="toolbar">
        <button type="button" className="edit-button" onClick={() => setEditing(true)}>
          Edit notes
        </button>
        <span className="toolbar-note">The editor loads when you need it</span>
      </div>
      <div className="editor-surface prose preview" onClick={() => setEditing(true)}>
        {children}
      </div>
    </div>
  );
}
