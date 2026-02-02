import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingDisplay() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-transparent">
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/50 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-2xl ring-1 ring-white/10">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse font-hacker">
          Initializing Editor...
        </p>
      </div>
    </div>
  );
}
