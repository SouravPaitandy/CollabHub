import React from "react";
import { useCurrentEditor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
  ListChecks,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Indent,
  Outdent,
  RemoveFormatting,
  Highlighter,
} from "lucide-react";
import { motion } from "framer-motion";
import FontFamilyDropdown from "./toolbar/FontFamilyDropdown";
import ColorPicker from "./toolbar/ColorPicker";

const ToolbarButton = ({ onClick, isActive, disabled, icon: Icon, title }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      p-2 rounded-lg transition-all duration-200 relative group
      ${
        isActive
          ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
          : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-100"
      }
      ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
    `}
    title={title}
  >
    <Icon className="w-4 h-4" />
    {isActive && (
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-500 rounded-full mb-1" />
    )}
  </button>
);

const Divider = () => (
  <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1 self-center" />
);

export default function EditorToolbar({ editor }) {
  if (!editor) return null;

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-20 z-40 mx-auto max-w-fit"
    >
      <div className="glass-panel px-2 py-1.5 rounded-2xl flex flex-wrap items-center gap-1 shadow-xl shadow-indigo-500/5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-white/10 ring-1 ring-black/5">
        {/* History Group */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            icon={Undo}
            title="Undo (Ctrl+Z)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            icon={Redo}
            title="Redo (Ctrl+Y)"
          />
        </div>

        <Divider />

        {/* Font Controls */}
        <div className="flex items-center gap-1">
          <FontFamilyDropdown editor={editor} />
        </div>

        <Divider />

        {/* Text Style Group */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            icon={Bold}
            title="Bold (Ctrl+B)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            icon={Italic}
            title="Italic (Ctrl+I)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            icon={UnderlineIcon}
            title="Underline (Ctrl+U)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            icon={Strikethrough}
            title="Strikethrough"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}
            icon={Code}
            title="Inline Code"
          />
        </div>

        <Divider />

        {/* Subscript/Superscript */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            isActive={editor.isActive("subscript")}
            icon={SubscriptIcon}
            title="Subscript"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            isActive={editor.isActive("superscript")}
            icon={SuperscriptIcon}
            title="Superscript"
          />
        </div>

        <Divider />

        {/* Color Pickers */}
        <div className="flex items-center gap-0.5">
          <ColorPicker editor={editor} type="text" />
          <ColorPicker editor={editor} type="highlight" />
        </div>

        <Divider />

        {/* Heading Group */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive("heading", { level: 1 })}
            icon={Heading1}
            title="Heading 1"
          />
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive("heading", { level: 2 })}
            icon={Heading2}
            title="Heading 2"
          />
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor.isActive("heading", { level: 3 })}
            icon={Heading3}
            title="Heading 3"
          />
        </div>

        <Divider />

        {/* Alignment Group */}
        <div className="hidden sm:flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            icon={AlignLeft}
            title="Align Left"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            icon={AlignCenter}
            title="Align Center"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            icon={AlignRight}
            title="Align Right"
          />
        </div>

        <Divider />

        {/* List Group */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            icon={List}
            title="Bullet List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            icon={ListOrdered}
            title="Ordered List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            isActive={editor.isActive("taskList")}
            icon={ListChecks}
            title="Task List"
          />
        </div>

        <Divider />

        {/* Indent/Outdent */}
        <div className="hidden md:flex items-center gap-0.5">
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().sinkListItem("listItem").run()
            }
            disabled={!editor.can().sinkListItem("listItem")}
            icon={Indent}
            title="Indent"
          />
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().liftListItem("listItem").run()
            }
            disabled={!editor.can().liftListItem("listItem")}
            icon={Outdent}
            title="Outdent"
          />
        </div>

        <Divider />

        {/* Insert Group */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            icon={Quote}
            title="Blockquote"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            icon={Minus}
            title="Horizontal Rule"
          />
        </div>

        <Divider />

        {/* Clear Formatting */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().clearNodes().unsetAllMarks().run()
            }
            icon={RemoveFormatting}
            title="Clear Formatting"
          />
        </div>
      </div>
    </motion.div>
  );
}
