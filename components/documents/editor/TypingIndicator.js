import React from "react";

export default function TypingIndicator({ typingUsers }) {
  if (typingUsers.length === 0) return null;
  
  return (
    <div className="px-4 py-2 text-sm bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-100 dark:border-yellow-800/30 transition-all duration-300 ease-in-out">
      <span className="flex items-center">
        <span className="inline-flex mr-2">
          <span className="animate-bounce delay-100 mx-0.5 h-1.5 w-1.5 bg-yellow-500 rounded-full"></span>
          <span className="animate-bounce delay-300 mx-0.5 h-1.5 w-1.5 bg-yellow-500 rounded-full"></span>
          <span className="animate-bounce delay-500 mx-0.5 h-1.5 w-1.5 bg-yellow-500 rounded-full"></span>
        </span>
        <span className="font-medium text-yellow-700 dark:text-yellow-200">
          {typingUsers.length === 1 ? (
            <>{typingUsers[0].name} is typing...</>
          ) : (
            <>{typingUsers.map((u) => u.name).join(", ")} are typing...</>
          )}
        </span>
      </span>
    </div>
  );
}