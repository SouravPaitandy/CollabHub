import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function WordCount({ editor }) {
  const [stats, setStats] = useState({ words: 0, chars: 0, paragraphs: 0 });
  const [expanded, setExpanded] = useState(false);
  
  useEffect(() => {
    if (!editor) return;
    
    const calculateStats = () => {
      const text = editor.getText();
      const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
      const words = text.split(/\s+/).filter(word => word.length > 0).length;
      const chars = text.length;
      
      setStats({ words, chars, paragraphs });
    };
    
    // Initial calculation
    calculateStats();
    
    // Update on content change
    editor.on('update', calculateStats);
    
    return () => {
      editor.off('update', calculateStats);
    };
  }, [editor]);
  
  return (
    <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
        >
          {expanded ? 'Hide statistics' : 'Show statistics'}
        </button>
        <div className="flex space-x-4">
          <span>{stats.words} words</span>
          <span>{stats.chars} characters</span>
        </div>
      </div>
      
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: expanded ? 'auto' : 0,
          opacity: expanded ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        {expanded && (
          <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-indigo-500 dark:text-indigo-400">{stats.paragraphs}</span>
              <span className="text-gray-500 dark:text-gray-400">Paragraphs</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-indigo-500 dark:text-indigo-400">
                {Math.ceil(stats.words / 200)}
              </span>
              <span className="text-gray-500 dark:text-gray-400">Min read</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-indigo-500 dark:text-indigo-400">
                {Math.round((stats.chars / Math.max(stats.words, 1)) * 10) / 10}
              </span>
              <span className="text-gray-500 dark:text-gray-400">Avg word length</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}