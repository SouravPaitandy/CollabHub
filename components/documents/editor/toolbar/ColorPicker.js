import React, { useState, useRef, useEffect } from "react";
import { Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = [
  { name: "Default", value: null },
  { name: "Black", value: "#000000" },
  { name: "Gray", value: "#6B7280" },
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F97316" },
  { name: "Yellow", value: "#EAB308" },
  { name: "Green", value: "#22C55E" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Purple", value: "#A855F7" },
  { name: "Pink", value: "#EC4899" },
];

const HIGHLIGHT_COLORS = [
  { name: "None", value: null },
  { name: "Yellow", value: "#FEF3C7" },
  { name: "Green", value: "#D1FAE5" },
  { name: "Blue", value: "#DBEAFE" },
  { name: "Purple", value: "#E9D5FF" },
  { name: "Pink", value: "#FCE7F3" },
  { name: "Orange", value: "#FED7AA" },
];

export default function ColorPicker({ editor, type = "text" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const colors = type === "text" ? COLORS : HIGHLIGHT_COLORS;
  const isText = type === "text";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleColorSelect = (color) => {
    if (isText) {
      if (color) {
        editor.chain().focus().setColor(color).run();
      } else {
        editor.chain().focus().unsetColor().run();
      }
    } else {
      if (color) {
        editor.chain().focus().setHighlight({ color }).run();
      } else {
        editor.chain().focus().unsetHighlight().run();
      }
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200"
        title={isText ? "Text Color" : "Highlight Color"}
      >
        <Palette className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 mt-1 glass-card rounded-xl shadow-xl p-3 z-50 border border-border/50"
          >
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {isText ? "Text Color" : "Highlight"}
            </p>
            <div className="grid grid-cols-6 gap-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleColorSelect(color.value)}
                  className={`w-7 h-7 rounded-md border-2 transition-all hover:scale-110 ${
                    color.value
                      ? ""
                      : "bg-white dark:bg-gray-800 relative overflow-hidden"
                  }`}
                  style={{
                    backgroundColor: color.value || "transparent",
                    borderColor: color.value || "#E5E7EB",
                  }}
                  title={color.name}
                >
                  {!color.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-px bg-red-500 transform rotate-45"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
