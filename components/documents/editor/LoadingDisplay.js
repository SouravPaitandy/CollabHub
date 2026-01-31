import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingDisplay() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#FAFAFA] dark:bg-[#0A0A0A]">
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/50 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-2xl">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
          Initializing Editor...
        </p>
      </div>
    </div>
  );
}
