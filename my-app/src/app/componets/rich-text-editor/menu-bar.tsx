"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { Toggle } from "../ui/toggle";
import { Editor } from "@tiptap/react";

export default function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const Options = [
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: editor.isActive("heading", { level: 3 }),
    },
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive("bold"),
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
    },
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      pressed: editor.isActive({ textAlign: "left" }),
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      pressed: editor.isActive({ textAlign: "center" }),
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      pressed: editor.isActive({ textAlign: "right" }),
    },
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive("orderedList"),
    },
    {
      icon: <Highlighter className="size-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      pressed: editor.isActive("highlight"),
    },
    {
      icon: <ImageIcon className="size-4" />,
      onClick: () => document.getElementById("image-upload-input")?.click(),
      pressed: false,
    },
    // image controls — only show when image selected
    {
      icon: <X className="size-4" />,
      onClick: () => editor.chain().focus().deleteSelection().run(),
      pressed: false,
      show: editor.isActive("image"),
    },
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () =>
        editor.chain().focus().updateAttributes("image", { class: "float-left mr-2" }).run(),
      pressed: false,
      show: editor.isActive("image"),
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () =>
        editor.chain().focus().updateAttributes("image", { class: "mx-auto" }).run(),
      pressed: false,
      show: editor.isActive("image"),
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () =>
        editor.chain().focus().updateAttributes("image", { class: "float-right ml-2" }).run(),
      pressed: false,
      show: editor.isActive("image"),
    },
  ];

  return (
    <div className="border rounded-md p-1 mb-1 bg-slate-50 space-x-2 z-50">
      {Options.filter(opt => opt.show === undefined || opt.show).map((option, index) => (
        <Toggle key={index} pressed={option.pressed} onPressedChange={option.onClick}>
          {option.icon}
        </Toggle>
      ))}

      {/* Hidden image upload */}
      <input
        type="file"
        id="image-upload-input"
        style={{ display: "none" }}
        accept="image/*"
        onChange={(e) => handleImageUpload(e, editor)}
      />
    </div>
  );
}

const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, editor: Editor | null) => {
  if (!editor || !e.target.files?.[0]) return;
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onloadend = () => {
    const imageUrl = reader.result as string;
    editor.chain().focus().setImage({ src: imageUrl, class: "mx-auto" }).run();
  };
  reader.readAsDataURL(file);
};
