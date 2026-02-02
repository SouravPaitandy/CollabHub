import React from "react";
import { format } from "date-fns";
import { FaTimes } from "react-icons/fa";

export default function VersionHistoryModal({
  isOpen,
  onClose,
  versions,
  selectedVersion,
  setSelectedVersion,
  restoreVersion,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-background/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col ring-1 ring-white/5 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <h2 className="text-xl font-bold font-hacker tracking-tight">
            Version History
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-white/5 rounded-full"
          >
            <FaTimes />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto p-2">
            {versions.length > 0 ? (
              <ul className="space-y-1">
                {versions.map((version) => (
                  <li key={version.id}>
                    <button
                      onClick={() => setSelectedVersion(version)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedVersion?.id === version.id
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="font-medium">
                        {format(new Date(version.createdAt), "PPp")}
                      </div>
                      <div className="text-xs opacity-70">
                        By {version.user?.name || "Unknown user"}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                No previous versions found
              </div>
            )}
          </div>

          <div className="w-2/3 overflow-y-auto p-4">
            {selectedVersion ? (
              <>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded mb-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Version from{" "}
                    {format(new Date(selectedVersion.createdAt), "PPp")}
                  </div>
                  <div className="text-sm">
                    Created by {selectedVersion.user?.name || "Unknown user"}
                  </div>
                </div>

                <div
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedVersion.content }}
                />

                <div className="mt-4 text-right">
                  <button
                    onClick={() => restoreVersion(selectedVersion)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium shadow-lg shadow-primary/20 transition-all"
                  >
                    Restore This Version
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center p-6 text-gray-500 dark:text-gray-400">
                Select a version to preview
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
