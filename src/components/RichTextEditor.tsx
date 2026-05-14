"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    Heading1, Heading2, List, ListOrdered, Quote,
    AlignLeft, AlignCenter, AlignRight, Link as LinkIcon,
    Undo, Redo,
} from "lucide-react";

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({ openOnClick: false }),
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Placeholder.configure({ placeholder: placeholder ?? "Write something..." }),
        ],
        content: value,
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "min-h-[200px] px-3 py-2 text-sm text-slate-800 focus:outline-none prose prose-sm max-w-none",
            },
        },
    });

    if (!editor) return null;

    const ToolButton = ({
        onClick,
        active,
        title,
        children,
    }: {
        onClick: () => void;
        active?: boolean;
        title: string;
        children: React.ReactNode;
    }) => (
        <button
            type="button"
            title={title}
            onClick={onClick}
            className={`p-1.5 rounded transition-colors ${
                active
                    ? "bg-primary text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
            }`}
        >
            {children}
        </button>
    );

    const handleLink = () => {
        const url = window.prompt("Enter URL", editor.getAttributes("link").href ?? "");
        if (url === null) return;
        if (url === "") {
            editor.chain().focus().unsetLink().run();
        } else {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    return (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-slate-200 bg-slate-50">
                <ToolButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
                    <Bold className="h-3.5 w-3.5" />
                </ToolButton>
                <ToolButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
                    <Italic className="h-3.5 w-3.5" />
                </ToolButton>
                <ToolButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline">
                    <UnderlineIcon className="h-3.5 w-3.5" />
                </ToolButton>
                <ToolButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
                    <Strikethrough className="h-3.5 w-3.5" />
                </ToolButton>

                <div className="w-px h-4 bg-slate-200 mx-1" />

                <ToolButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1">
                    <Heading1 className="h-3.5 w-3.5" />
                </ToolButton>
                <ToolButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
                    <Heading2 className="h-3.5 w-3.5" />
                </ToolButton>

                <div className="w-px h-4 bg-slate-200 mx-1" />

                <ToolButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List">
                    <List className="h-3.5 w-3.5" />
                </ToolButton>
                <ToolButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered List">
                    <ListOrdered className="h-3.5 w-3.5" />
                </ToolButton>
                <ToolButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote">
                    <Quote className="h-3.5 w-3.5" />
                </ToolButton>

                <div className="w-px h-4 bg-slate-200 mx-1" />

                <ToolButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align Left">
                    <AlignLeft className="h-3.5 w-3.5" />
                </ToolButton>
                <ToolButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align Center">
                    <AlignCenter className="h-3.5 w-3.5" />
                </ToolButton>
                <ToolButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align Right">
                    <AlignRight className="h-3.5 w-3.5" />
                </ToolButton>

                <div className="w-px h-4 bg-slate-200 mx-1" />

                <ToolButton onClick={handleLink} active={editor.isActive("link")} title="Link">
                    <LinkIcon className="h-3.5 w-3.5" />
                </ToolButton>

                <div className="w-px h-4 bg-slate-200 mx-1" />

                <ToolButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
                    <Undo className="h-3.5 w-3.5" />
                </ToolButton>
                <ToolButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
                    <Redo className="h-3.5 w-3.5" />
                </ToolButton>
            </div>

            {/* Editor content */}
            <EditorContent editor={editor} />
        </div>
    );
}
