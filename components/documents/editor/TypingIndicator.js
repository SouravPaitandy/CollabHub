import React from "react";

export default function TypingIndicator({ typingUsers }) {
  if (typingUsers.length === 0) return null;

  return (
    <div className="absolute bottom-4 left-4 z-20 animate-in fade-in slide-in-from-bottom-2 duration-300 pointer-events-none">
      <div className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 shadow-lg shadow-indigo-500/10 flex items-center gap-2">
        <span className="flex items-center gap-0.5">
          <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" />
        </span>
        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
          {typingUsers.length === 1 ? (
            <span className="font-semibold text-indigo-500 dark:text-indigo-400">
              {typingUsers[0].name}
            </span>
          ) : (
            <span className="font-semibold text-indigo-500 dark:text-indigo-400">
              {typingUsers.length} people
            </span>
          )}
          <span className="ml-1 opacity-70">typing...</span>
        </span>
      </div>
    </div>
  );
}
