import React, { useEffect, useState, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link as LinkIcon,
  Highlighter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EditorBubbleMenu({ editor }) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);

  useEffect(() => {
    const updatePosition = () => {
      const { selection } = editor.state;
      const { from, to } = selection;

      // Only show if there's a selection
      if (from === to) {
        setIsVisible(false);
        return;
      }

      const { view } = editor;
      const start = view.coordsAtPos(from);
      const end = view.coordsAtPos(to);

      const editorRect = view.dom.getBoundingClientRect();

      // Calculate center position above selection
      const left = (start.left + end.left) / 2 - editorRect.left;
      const top = start.top - editorRect.top - 50; // 50px above selection

      setPosition({ top, left });
      setIsVisible(true);
    };

    if (!editor) return;

    editor.on("selectionUpdate", updatePosition);
    editor.on("update", updatePosition);

    return () => {
      editor.off("selectionUpdate", updatePosition);
      editor.off("update", updatePosition);
    };
  }, [editor]);

  if (!editor || !isVisible) return null;

  const BubbleButton = ({ onClick, isActive, icon: Icon, title }) => (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`p-2 rounded-md transition-all ${
        isActive
          ? "bg-indigo-500 text-white"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
      }`}
      title={title}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        style={{
          position: "absolute",
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: "translateX(-50%)",
          zIndex: 100,
        }}
        className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-1 backdrop-blur-lg"
      >
        <BubbleButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          icon={Bold}
          title="Bold"
        />
        <BubbleButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          icon={Italic}
          title="Italic"
        />
        <BubbleButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          icon={Underline}
          title="Underline"
        />
        <BubbleButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          icon={Strikethrough}
          title="Strike"
        />
        <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />
        <BubbleButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          icon={Code}
          title="Code"
        />
        <BubbleButton
          onClick={() => {
            const previousUrl = editor.getAttributes("link").href;
            const url = window.prompt("URL", previousUrl);

            if (url === null) return;

            if (url === "") {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
              return;
            }

            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url })
              .run();
          }}
          isActive={editor.isActive("link")}
          icon={LinkIcon}
          title="Link"
        />
        <BubbleButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive("highlight")}
          icon={Highlighter}
          title="Highlight"
        />
      </motion.div>
    </AnimatePresence>
  );
}
