"use client";

import { EditorContent, useEditor, type Extensions } from "@tiptap/react";
import { EditorSkeleton } from "../Skeletons";

type Props = {
  extensions: Extensions;
  content: string;
  autofocus?: boolean;
};

/** The editing UI shared by both versions. Only the extensions differ. */
export function EditorView({ extensions, content, autofocus = false }: Props) {
  const editor = useEditor({
    extensions,
    content,
    autofocus: autofocus ? "end" : false,
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    editorProps: { attributes: { class: "prose editor-surface", "aria-label": "Report notes" } },
  });

  if (!editor) return <EditorSkeleton />;

  const tools = [
    { label: "Bold", short: "B", active: editor.isActive("bold"), run: () => editor.chain().focus().toggleBold().run() },
    { label: "Italic", short: "I", active: editor.isActive("italic"), run: () => editor.chain().focus().toggleItalic().run() },
    {
      label: "Heading",
      short: "H2",
      active: editor.isActive("heading", { level: 2 }),
      run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "Bullet list",
      short: "List",
      active: editor.isActive("bulletList"),
      run: () => editor.chain().focus().toggleBulletList().run(),
    },
  ];

  return (
    <div className="editor">
      <div className="toolbar" role="toolbar" aria-label="Formatting">
        {tools.map((tool) => (
          <button
            key={tool.label}
            type="button"
            aria-label={tool.label}
            aria-pressed={tool.active}
            className={tool.active ? "tool active" : "tool"}
            onClick={tool.run}
          >
            {tool.short}
          </button>
        ))}
        <span className="toolbar-note">Editing</span>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
