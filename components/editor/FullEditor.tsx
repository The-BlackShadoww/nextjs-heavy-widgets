"use client";

import StarterKit from "@tiptap/starter-kit";
import { EditorView } from "./EditorView";

const extensions = [StarterKit];

/** BEFORE: the whole StarterKit bundle (20+ extensions), even though the page uses four tools. */
export function FullEditor({ content }: { content: string }) {
  return <EditorView extensions={extensions} content={content} />;
}
