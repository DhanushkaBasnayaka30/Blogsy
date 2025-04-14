"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import CustomImage from "./custom-image";
import MenuBar from "./menu-bar";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({
  content,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { HTMLAttributes: { class: "list-disc ml-3" } },
        orderedList: { HTMLAttributes: { class: "list-decimal ml-3" } },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight,
      CustomImage,
    ],
    content,
    editorProps: {
      attributes: {
        class: "min-h-[350px] border border-gray-500  text-xl outline-none rounded-md bg-slate-50 py-2 px-3",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });
console.log(content);
  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
