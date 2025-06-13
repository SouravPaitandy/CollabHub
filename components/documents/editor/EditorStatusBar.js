import React from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function EditorStatusBar({ lastSaved }) {
  return (
    <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30 flex justify-between items-center">
      <div className='hidden md:block'>
        <span className="inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Press <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded">Ctrl+B</kbd> for bold, <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded">Ctrl+I</kbd> for italic
        </span>
      </div>
      {lastSaved && (
        <div>
          Last saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
        </div>
      )}
    </div>
  );
}