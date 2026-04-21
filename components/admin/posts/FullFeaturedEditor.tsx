"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type EditorProps = {
  format?: string;
  newBlog: string;
  setNewBlogAction: (value: string) => void;
};

export default function FullFeaturedEditor({
  newBlog,
  setNewBlogAction,
}: EditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: newBlog,
    immediatelyRender: false,
    onUpdate: ({ editor: activeEditor }) => {
      setNewBlogAction(activeEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }
    const current = editor.getHTML();
    if (newBlog !== current) {
      editor.commands.setContent(newBlog, false);
    }
  }, [editor, newBlog]);

  if (!editor) {
    return null;
  }

  const buttonClass = (active: boolean) =>
    `px-2 py-1 rounded text-sm border ${active ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-300"
    }`;

  return (
    <div className="rounded-md border border-gray-300 bg-white">
      <div className="flex flex-wrap gap-2 border-b border-gray-200 p-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={buttonClass(editor.isActive("bold"))}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={buttonClass(editor.isActive("italic"))}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={buttonClass(editor.isActive("strike"))}
        >
          Strike
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={buttonClass(editor.isActive("heading", { level: 2 }))}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={buttonClass(editor.isActive("bulletList"))}
        >
          Bullets
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={buttonClass(editor.isActive("orderedList"))}
        >
          Numbered
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={buttonClass(editor.isActive("blockquote"))}
        >
          Quote
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={buttonClass(editor.isActive("codeBlock"))}
        >
          Code
        </button>
      </div>
      <EditorContent editor={editor} className="min-h-80 px-3 py-4 text-black" />
    </div>
  );
}
