"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Terminal, 
  Link as LinkIcon, 
  Minus, 
  Undo, 
  Redo, 
  Heading1, 
  Heading2, 
  Heading3
} from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = "Write something..." }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#adc6ff] hover:underline cursor-pointer",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none min-h-[200px] p-4 text-[#e5e1e4] text-sm leading-relaxed outline-none overflow-y-auto",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const [linkUrl, setLinkUrl] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setPopoverOpen(open);
    if (open && editor) {
      setLinkUrl(editor.getAttributes("link").href || "");
    }
  };

  const saveLink = () => {
    if (!editor) return;

    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    }
    setPopoverOpen(false);
  };

  const removeLink = () => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setPopoverOpen(false);
  };

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive, 
    disabled = false, 
    children, 
    title 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    disabled?: boolean; 
    children: React.ReactNode; 
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded transition-all flex items-center justify-center hover:bg-[#201f22] ${
        isActive 
          ? "bg-[#adc6ff]/20 text-[#adc6ff] font-bold" 
          : "text-[#c2c6d6] hover:text-[#e5e1e4]"
      } disabled:opacity-30 disabled:hover:bg-transparent`}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full bg-[#030303] border border-[#27272a] rounded-xl overflow-hidden focus-within:border-[#adc6ff] focus-within:ring-4 focus-within:ring-[#adc6ff]/10 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-[#0c0c0e] border-b border-[#27272a]">
        <ToolbarButton
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-[1px] h-6 bg-[#27272a] mx-1" />

        <ToolbarButton
          title="Bold (Ctrl+B)"
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Italic (Ctrl+I)"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Underline (Ctrl+U)"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-[1px] h-6 bg-[#27272a] mx-1" />

        <ToolbarButton
          title="Heading 1"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-[1px] h-6 bg-[#27272a] mx-1" />

        <ToolbarButton
          title="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Numbered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-[1px] h-6 bg-[#27272a] mx-1" />

        <ToolbarButton
          title="Inline Code"
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
        >
          <Code className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Code Block"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
        >
          <Terminal className="w-4 h-4" />
        </ToolbarButton>
        <Popover open={popoverOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <button
              type="button"
              title="Add Link"
              className={`p-2 rounded transition-all flex items-center justify-center hover:bg-[#201f22] ${
                editor.isActive("link") 
                  ? "bg-[#adc6ff]/20 text-[#adc6ff] font-bold" 
                  : "text-[#c2c6d6] hover:text-[#e5e1e4]"
              }`}
            >
              <LinkIcon className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-[#131315] border border-[#424754] text-[#e5e1e4] p-4 shadow-xl rounded-xl space-y-3" align="start">
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-[#adc6ff]">Edit Link</h4>
              <p className="text-[10px] text-[#c2c6d6]">Enter URL to link to the selected text</p>
            </div>
            <div className="flex gap-2">
              <Input 
                type="text" 
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="bg-[#030303] border border-[#27272a] rounded-lg text-xs text-[#e5e1e4] focus-visible:border-[#adc6ff] focus-visible:ring-[#adc6ff]/20"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    saveLink();
                  }
                }}
              />
            </div>
            <div className="flex gap-2 justify-end">
              {editor.isActive("link") && (
                <button
                  type="button"
                  onClick={removeLink}
                  className="px-3 py-1.5 bg-[#93000a] text-[#ffdad6] rounded-lg font-bold text-[11px] hover:brightness-110 active:scale-95 transition-all"
                >
                  Remove
                </button>
              )}
              <button
                type="button"
                onClick={saveLink}
                className="px-3 py-1.5 bg-[#adc6ff] text-[#002e6a] rounded-lg font-bold text-[11px] hover:brightness-110 active:scale-95 transition-all"
              >
                Apply
              </button>
            </div>
          </PopoverContent>
        </Popover>
        <ToolbarButton
          title="Horizontal Rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Editor Content Area */}
      <div className="relative">
        <style jsx global>{`
          .ProseMirror p.is-empty::before {
            content: attr(data-placeholder);
            float: left;
            color: #424754;
            pointer-events: none;
            height: 0;
          }
          .ProseMirror {
            outline: none;
            min-height: 200px;
          }
          .ProseMirror ul {
            list-style-type: disc;
            padding-left: 1.5rem;
            margin: 0.5rem 0;
          }
          .ProseMirror ol {
            list-style-type: decimal;
            padding-left: 1.5rem;
            margin: 0.5rem 0;
          }
          .ProseMirror blockquote {
            border-left: 3px solid #adc6ff;
            padding-left: 1rem;
            color: #c2c6d6;
            font-style: italic;
            margin: 0.8rem 0;
          }
          .ProseMirror code {
            background-color: #201f22;
            color: #ffb4ab;
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-family: monospace;
            font-size: 0.85em;
          }
          .ProseMirror pre {
            background-color: #131315;
            color: #e5e1e4;
            padding: 0.8rem;
            border-radius: 8px;
            font-family: monospace;
            overflow-x: auto;
            margin: 0.8rem 0;
            border: 1px solid #27272a;
          }
          .ProseMirror pre code {
            background-color: transparent;
            padding: 0;
            color: inherit;
            font-size: inherit;
          }
          .ProseMirror h1 {
            font-size: 1.8rem;
            font-weight: 700;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
          }
          .ProseMirror h2 {
            font-size: 1.4rem;
            font-weight: 600;
            margin-top: 0.8rem;
            margin-bottom: 0.4rem;
          }
          .ProseMirror h3 {
            font-size: 1.2rem;
            font-weight: 600;
            margin-top: 0.6rem;
            margin-bottom: 0.3rem;
          }
          .ProseMirror hr {
            border: none;
            border-top: 1px solid #27272a;
            margin: 1.5rem 0;
          }
          .ProseMirror a {
            color: #adc6ff;
            text-decoration: underline;
            cursor: pointer;
          }
        `}</style>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
