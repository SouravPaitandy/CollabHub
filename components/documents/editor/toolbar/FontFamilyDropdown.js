import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FONT_FAMILIES = [
  { name: "Default", value: "" },
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Times New Roman", value: "Times New Roman, serif" },
  { name: "Courier New", value: "Courier New, monospace" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Verdana", value: "Verdana, sans-serif" },
  { name: "Comic Sans MS", value: "Comic Sans MS, cursive" },
];

export default function FontFamilyDropdown({ editor }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentFontFamily = editor.getAttributes("textStyle").fontFamily || "";
  const currentFont =
    FONT_FAMILIES.find((font) => font.value === currentFontFamily) ||
    FONT_FAMILIES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors min-w-[120px]"
        title="Font Family"
      >
        <span className="flex-1 text-left truncate">{currentFont.name}</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 mt-1 w-48 glass-card rounded-xl shadow-xl py-1 z-50 overflow-hidden border border-border/50"
          >
            {FONT_FAMILIES.map((font) => (
              <button
                key={font.value}
                onClick={() => {
                  if (font.value) {
                    editor
                      .chain()
                      .focus()
                      .setMark("textStyle", { fontFamily: font.value })
                      .run();
                  } else {
                    editor.chain().focus().unsetMark("textStyle").run();
                  }
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  editor.getAttributes("textStyle").fontFamily === font.value
                    ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    : "text-foreground hover:bg-secondary/50"
                }`}
                style={{ fontFamily: font.value || "inherit" }}
              >
                {font.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
