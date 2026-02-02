import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Printer,
  Share2,
  MoreVertical,
  Check,
} from "lucide-react";
import Image from "next/image";

export default function DocumentHeader({
  documentTitle,
  setDocumentTitle,
  connected,
  isSaving,
  saveDocument,
  exportDocument,
  navigateBack,
  userName,
}) {
  const [titleEditing, setTitleEditing] = useState(false);
  const [inputTitle, setInputTitle] = useState(documentTitle);

  useEffect(() => {
    setInputTitle(documentTitle);
  }, [documentTitle]);

  const handleTitleChange = () => {
    if (inputTitle.trim() !== "") {
      setDocumentTitle(inputTitle);
    } else {
      setInputTitle(documentTitle);
    }
    setTitleEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleTitleChange();
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full p-6 z-50 pointer-events-none flex justify-between items-start">
      {/* Left Group: Back & Title */}
      <div className="flex items-center gap-4 pointer-events-auto">
        {/* <motion.button
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={navigateBack}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-700 dark:text-white/80 backdrop-blur-md border border-white/10 shadow-sm transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button> */}

        <div className="flex flex-col">
          {titleEditing ? (
            <input
              autoFocus
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              onBlur={handleTitleChange}
              onKeyDown={handleKeyDown}
              className="text-xl font-bold bg-transparent border-b-2 border-indigo-500 focus:outline-none text-gray-900 dark:text-white min-w-[200px]"
            />
          ) : (
            <motion.h1
              onClick={() => setTitleEditing(true)}
              className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-gray-400 cursor-pointer hover:opacity-80 transition-opacity"
            >
              {documentTitle || "Untitled Document"}
            </motion.h1>
          )}
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500"}`}
            />
            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
              {connected ? "Live" : "Offline"}
            </span>
            {isSaving && (
              <span className="text-[10px] text-gray-400 animate-pulse ml-2">
                Saving...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Group: Actions */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={saveDocument}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 font-medium text-sm transition-all"
        >
          {isSaving ? (
            <span className="animate-spin mr-1">↻</span>
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Save</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportDocument}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-muted-foreground hover:text-foreground backdrop-blur-md border border-white/10 shadow-sm transition-colors"
          title="Print / PDF"
        >
          <Printer className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-muted-foreground hover:text-foreground backdrop-blur-md border border-white/10 shadow-sm transition-colors"
        >
          <Share2 className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="sm:hidden p-2 rounded-full bg-white/10 hover:bg-white/20 text-muted-foreground hover:text-foreground backdrop-blur-md border border-white/10 shadow-sm transition-colors"
        >
          <MoreVertical className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}
