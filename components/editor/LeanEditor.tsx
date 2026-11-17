"use client";

import Bold from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Italic from "@tiptap/extension-italic";
import { BulletList, ListItem } from "@tiptap/extension-list";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { UndoRedo } from "@tiptap/extensions";
import { EditorView } from "./EditorView";

// AFTER: only the extensions this page actually uses.
const extensions = [Document, Paragraph, Text, Bold, Italic, Heading.configure({ levels: [2] }), BulletList, ListItem, UndoRedo];

export function LeanEditor({ content }: { content: string }) {
  return <EditorView extensions={extensions} content={content} autofocus />;
}
