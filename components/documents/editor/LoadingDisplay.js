import React from "react";

export default function LoadingDisplay() {
  return (
    <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="text-gray-500 dark:text-gray-400">
        Loading editor...
      </div>
    </div>
  );
}