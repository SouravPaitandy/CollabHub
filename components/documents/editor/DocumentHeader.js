import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaSave,
  FaShareAlt,
  FaDownload,
  FaPrint,
  FaArrowLeft,
  FaHistory,
  FaEllipsisV,
} from "react-icons/fa";

export default function DocumentHeader({
  documentTitle,
  setDocumentTitle,
  connected,
  isSaving,
  saveDocument,
  exportDocument,
  navigateBack,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [titleEditing, setTitleEditing] = useState(false);
  const [inputTitle, setInputTitle] = useState(documentTitle);

  // Update local state when document title changes
  useEffect(() => {
    setInputTitle(documentTitle);
  }, [documentTitle]);

  // Handle title change
  const handleTitleChange = () => {
    if (inputTitle.trim()) {
      setDocumentTitle(inputTitle);
    } else {
      setInputTitle(documentTitle); // Reset to original if empty
    }
    setTitleEditing(false);
  };

  // Handle key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleChange();
    } else if (e.key === 'Escape') {
      setInputTitle(documentTitle);
      setTitleEditing(false);
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <motion.button
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={navigateBack}
            className="mr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label="Go back"
          >
            <FaArrowLeft />
          </motion.button>

          {titleEditing ? (
            <input
              type="text"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              onBlur={handleTitleChange}
              onKeyDown={handleKeyDown}
              className="text-xl font-semibold bg-transparent border border-indigo-300 dark:border-indigo-700 focus:ring-2 focus:ring-indigo-500 rounded p-1 w-full max-w-md dark:text-white"
              placeholder="Document Title"
              autoFocus
            />
          ) : (
            <h1
              onClick={() => setTitleEditing(true)}
              className="text-xl font-semibold dark:text-white cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 truncate max-w-md transition-colors duration-150"
              title="Click to edit title"
            >
              {documentTitle || "Untitled Document"}
            </h1>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <div className="hidden sm:flex items-center mr-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {connected ? (
                <span className="flex items-center text-green-500 dark:text-green-400">
                  <span className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Connected
                </span>
              ) : (
                <span className="flex items-center text-red-500 dark:text-red-400">
                  <span className="w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full mr-2"></span>
                  Disconnected
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={saveDocument}
              disabled={isSaving || !connected}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md flex items-center disabled:bg-indigo-300 dark:disabled:bg-indigo-800/50 transition-all duration-200 text-sm shadow-sm hover:shadow"
            >
              <FaSave className="mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{isSaving ? "Saving..." : "Save"}</span>
            </motion.button>
            
            {/* Responsive design: show actions in dropdown on small screens */}
            <div className="relative sm:hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <FaEllipsisV />
              </motion.button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-md p-2 z-10 w-48 border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      exportDocument();
                      setShowDropdown(false);
                    }}
                    className="w-full text-left p-2 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
                  >
                    <FaDownload className="mr-2" /> Export as PDF
                  </button>
                  <button
                    onClick={() => {
                      window.print();
                      setShowDropdown(false);
                    }}
                    className="w-full text-left p-2 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
                  >
                    <FaPrint className="mr-2" /> Print
                  </button>
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="w-full text-left p-2 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
                  >
                    <FaShareAlt className="mr-2" /> Share
                  </button>
                </div>
              )}
            </div>
            
            {/* Regular buttons for larger screens */}
            <div className="hidden sm:flex items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportDocument}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                title="Export as PDF"
              >
                <FaDownload />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.print()}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                title="Print"
              >
                <FaPrint />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                title="Share Document"
              >
                <FaShareAlt />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}