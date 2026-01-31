import React from "react";
import { formatDistanceToNow } from "date-fns";

export default function EditorStatusBar({ lastSaved }) {
  return (
    <div className="absolute bottom-4 right-4 z-20 pointer-events-auto">
      <div className="px-3 py-1.5 rounded-full bg-white/50 dark:bg-black/20 backdrop-blur-md border border-white/10 flex items-center gap-3 shadow-lg hover:bg-white/60 dark:hover:bg-black/30 transition-all duration-300">
        <div className="hidden md:flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-white/50 dark:bg-white/10 border border-black/5 dark:border-white/10 font-sans">
              ⌘B
            </kbd>
          </span>
          <span className="w-px h-3 bg-current opacity-20" />
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-white/50 dark:bg-white/10 border border-black/5 dark:border-white/10 font-sans">
              ⌘I
            </kbd>
          </span>
        </div>

        {lastSaved && (
          <>
            <div className="w-px h-3 bg-gray-400/30 dark:bg-gray-600/30 hidden md:block" />
            <div className="text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
              Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
