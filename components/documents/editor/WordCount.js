import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function WordCount({ editor }) {
  const [stats, setStats] = useState({ words: 0, chars: 0, paragraphs: 0 });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const calculateStats = () => {
      const text = editor.getText();
      const paragraphs = text
        .split(/\n\s*\n/)
        .filter((p) => p.trim().length > 0).length;
      const words = text.split(/\s+/).filter((word) => word.length > 0).length;
      const chars = text.length;

      setStats({ words, chars, paragraphs });
    };

    // Initial calculation
    calculateStats();

    // Update on content change
    editor.on("update", calculateStats);

    return () => {
      editor.off("update", calculateStats);
    };
  }, [editor]);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto group">
      <motion.div
        layout
        className="px-4 py-1.5 rounded-full bg-white/50 dark:bg-black/20 backdrop-blur-md border border-white/10 flex items-center gap-4 shadow-lg hover:shadow-xl hover:bg-white/80 dark:hover:bg-black/40 transition-all duration-300 cursor-default"
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
            Words
          </span>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 font-mono tabular-nums">
            {stats.words}
          </span>
        </div>

        <div className="w-px h-3 bg-gray-400/20" />

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
            Chars
          </span>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 font-mono tabular-nums">
            {stats.chars}
          </span>
        </div>

        {/* Expanded stats on hover */}
        <div className="w-0 overflow-hidden group-hover:w-auto opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-4 border-l border-gray-400/20 pl-4">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
              Time
            </span>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 font-mono">
              {Math.ceil(stats.words / 200)}m
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
