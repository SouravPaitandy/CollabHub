import React from "react";

export default function TypingIndicator({ typingUsers }) {
  if (typingUsers.length === 0) return null;

  return (
    <div className="absolute bottom-4 left-4 z-20 animate-in fade-in slide-in-from-bottom-2 duration-300 pointer-events-none">
      <div className="px-3 py-1.5 rounded-full bg-background/60 backdrop-blur-xl border border-white/10 shadow-lg shadow-primary/5 flex items-center gap-2 ring-1 ring-black/5">
        <span className="flex items-center gap-0.5">
          <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1 h-1 bg-primary rounded-full animate-bounce" />
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          {typingUsers.length === 1 ? (
            <span className="font-semibold text-primary">
              {typingUsers[0].name}
            </span>
          ) : (
            <span className="font-semibold text-primary">
              {typingUsers.length} people
            </span>
          )}
          <span className="ml-1 opacity-70">typing...</span>
        </span>
      </div>
    </div>
  );
}
