"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
// import { format } from 'date-fns';

// Import subcomponents
import DocumentHeader from "./editor/DocumentHeader";
import EditorToolbar from "./editor/EditorToolbar";
import ActiveUsersDisplay from "./editor/ActiveUsersDisplay";
import TypingIndicator from "./editor/TypingIndicator";
import LoadingDisplay from "./editor/LoadingDisplay";
import { saveDocumentToAPI } from "./editor/apiUtils";
import WordCount from "./editor/WordCount";
import EditorStatusBar from "./editor/EditorStatusBar";

// import { setupAwareness } from "./editor/awarenessSetup";

// Import utils and configs
import { createEditorConfig } from "./editor/editorConfig";
import { setupYjsProvider, setupAwareness } from "./editor/yjsSetup";
import { useActivityTracker } from "./editor/hooks/useActivityTracker";
import { useTypingTracker } from "./editor/hooks/useTypingTracker";
import { useAutoSave } from "./editor/hooks/useAutoSave";
import {
  getRandomColor,
  getRandomDarkColor,
  createUserData,
} from "./editor/colorUtils";

import "./editor.css";

export default function DocumentEditor({
  documentId,
  collabId,
  initialContent,
  title,
  onSave,
}) {
  // Component state
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [documentTitle, setDocumentTitle] = useState(
    title || "Untitled Document"
  );
  const [connected, setConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [lastSaved, setLastSaved] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const pdfExportRef = useRef(null);
  const router = useRouter();
  const { theme } = useTheme();

  // const Html2Pdf = dynamic(() => import("html2pdf.js"), { ssr: false });

  const handleNavigateToDocuments = useCallback(() => {
    router.push(`/collab/${collabId}/documents`);
  }, [router, collabId]);

  // Refs for collaboration
  const ydocRef = useRef(null);
  const wsProviderRef = useRef(null);

  // User data and editor config
  const userData = useMemo(() => createUserData(session), [session]);
  const editorConfig = useMemo(
    () =>
      createEditorConfig({
        ydocRef,
        wsProviderRef,
        userData,
        initialContent,
        theme,
      }),
    [initialContent, userData, theme]
  );

  // Initialize editor
  const editor = useEditor(editorConfig, [
    editorConfig,
    ydocRef.current,
    wsProviderRef.current,
  ]);

  // Setup Yjs and WebSocket connection
  useEffect(() => {
    return setupYjsProvider({
      documentId,
      ydocRef,
      wsProviderRef,
      setConnected,
    });
  }, [documentId]);

  // Setup awareness for collaboration
  useEffect(() => {
    if (!wsProviderRef.current || !userData) return;

    return setupAwareness({
      wsProvider: wsProviderRef.current,
      userData,
      setActiveUsers,
    });
  }, [userData, wsProviderRef.current]);

  // Custom hooks for collaboration features
  useActivityTracker({ wsProviderRef, userData });
  useTypingTracker({ editor, wsProviderRef, userData, setTypingUsers });

  // In DocumentEditor.js, add this effect to update content when document changes
  useEffect(() => {
    if (editor && initialContent) {
      // Log the content to debug
      console.log("Setting editor content:", initialContent);

      // Set the content without creating a history entry
      editor.commands.setContent(initialContent, false);
    }
  }, [initialContent, editor]);

  const exportAsPDF = useCallback(() => {
    // Set a small delay to ensure styling is applied
    setTimeout(() => {
      // Get the editor content container
      const element = document.querySelector(".editor-content-container");

      if (!element) {
        toast.error("Could not generate PDF");
        return;
      }

      // Show loading indicator
      const loadingToast = toast.loading("Generating PDF...");

      // Use a direct conversion approach
      Promise.all([import("html2canvas"), import("jspdf")])
        .then(([html2canvasModule, jsPDFModule]) => {
          const html2canvas = html2canvasModule.default;
          const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;

          // Handle dark mode
          const originalBackground = element.style.backgroundColor;
          const originalColor = element.style.color;

          // Force simple colors for export
          element.style.backgroundColor =
            theme === "dark" ? "#1f2937" : "#ffffff";
          element.style.color = theme === "dark" ? "#f9fafb" : "#111827";

          html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
          })
            .then((canvas) => {
              // Restore original styles
              element.style.backgroundColor = originalBackground;
              element.style.color = originalColor;

              // Create PDF
              const pdf = new jsPDF("p", "mm", "a4");
              pdf.addImage(
                canvas.toDataURL("image/jpeg", 0.95),
                "JPEG",
                10,
                10,
                190,
                (canvas.height * 190) / canvas.width
              );
              pdf.save(`${documentTitle || "document"}.pdf`);

              toast.dismiss(loadingToast);
              toast.success("PDF generated successfully");
            })
            .catch((error) => {
              // Restore original styles
              element.style.backgroundColor = originalBackground;
              element.style.color = originalColor;

              toast.dismiss(loadingToast);
              console.error("Canvas generation error:", error);
              toast.error("Failed to generate PDF");
            });
        })
        .catch((error) => {
          toast.dismiss(loadingToast);
          console.error("Failed to load PDF libraries:", error);
          toast.error("Could not load PDF generation libraries");
        });
    }, 250);
  }, [documentTitle, theme]);

  // Add this function for version history
  const showVersionHistory = useCallback(() => {
    setShowHistory(true);
  }, []);

  // Modify the saveDocument function to track last saved time
  const saveDocument = useCallback(async () => {
    if (!editor || !documentId || !collabId) {
      toast.error("Cannot save: Missing editor or document information");
      return;
    }

    setIsSaving(true);
    try {
      const content = editor.getHTML();
      await saveDocumentToAPI({
        collabId,
        documentId,
        documentTitle,
        content,
        onSave,
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error("Error saving document:", error);
      toast.error(error.message || "Failed to save document");
    } finally {
      setIsSaving(false);
    }
  }, [editor, documentId, collabId, documentTitle, onSave]);

  useAutoSave({ editor, connected, saveDocument });

  // Add this effect for keyboard shortcuts
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event) => {
      // Save on Ctrl+S
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        saveDocument();
      }

      // Add more keyboard shortcuts here as needed
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor, saveDocument]);

  // Add effect for unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (editor && editor.state.doc.content.size > 14) {
        // More than default paragraph
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [editor]);

  // Loading state
  if (!editor) {
    return <LoadingDisplay />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-200"
    >
      <DocumentHeader
        documentTitle={documentTitle}
        setDocumentTitle={setDocumentTitle}
        connected={connected}
        isSaving={isSaving}
        saveDocument={saveDocument}
        exportDocument={exportAsPDF}
        navigateBack={handleNavigateToDocuments}
        userName={session.userName}
      />

      <EditorToolbar editor={editor} theme={theme} collabId={collabId} />

      <div className="bg-gray-50 dark:bg-gray-800/50 transition-all duration-200">
        <ActiveUsersDisplay activeUsers={activeUsers} />
        <TypingIndicator typingUsers={typingUsers} />
      </div>

      {/* Add a subtle animation for the editor */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="editor-content-container px-6 py-8 h-[60vh] overflow-y-auto bg-white dark:bg-gray-900 transition-all duration-200"
      >
        <EditorContent
          editor={editor}
          className="editor-content prose dark:prose-invert max-w-4xl mx-auto min-h-[60vh] focus:outline-none"
        />
      </motion.div>

      <div className="border-t border-gray-200 dark:border-gray-700">
        <WordCount editor={editor} />
        <EditorStatusBar lastSaved={lastSaved} />
      </div>
      {/* Add version history modal */}
      {/* {showHistory && (
      <VersionHistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        selectedVersion={selectedVersion}
        setSelectedVersion={setSelectedVersion}
        restoreVersion={handleRestoreVersion}
        versions={documentVersions}
      />
    )} */}
    </motion.div>
  );
}
