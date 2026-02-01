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

// New "Fresh Start" Components
import DocumentHeader from "./editor/DocumentHeader";
import EditorToolbar from "./editor/EditorToolbar";
import EditorStatusHub from "./editor/EditorStatusHub";
import LoadingDisplay from "./editor/LoadingDisplay";
import EditorBubbleMenu from "./editor/BubbleMenu";

// Logic & Utils
import { saveDocumentToAPI } from "./editor/apiUtils";
import { createEditorConfig } from "./editor/editorConfig";
import { setupYjsProvider, setupAwareness } from "./editor/yjsSetup";
import { useActivityTracker } from "./editor/hooks/useActivityTracker";
import { useTypingTracker } from "./editor/hooks/useTypingTracker";
import { useAutoSave } from "./editor/hooks/useAutoSave";
import { createUserData } from "./editor/colorUtils";

import "./editor.css";

export default function DocumentEditor({
  documentId,
  collabId,
  initialContent,
  title,
  onSave,
}) {
  // --- 1. State & Refs ---
  const { data: session } = useSession();
  const router = useRouter();
  const { theme } = useTheme();

  const [isSaving, setIsSaving] = useState(false);
  const [documentTitle, setDocumentTitle] = useState(
    title || "Untitled Document",
  );
  const [connected, setConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [lastSaved, setLastSaved] = useState(null);

  const ydocRef = useRef(null);
  const wsProviderRef = useRef(null);

  // --- 2. Setup Config ---
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
    [initialContent, userData, theme],
  );

  const editor = useEditor(editorConfig, [editorConfig]);

  // --- 3. Effects (Collaboration & Logic) ---

  // Connect to WebSocket
  useEffect(() => {
    return setupYjsProvider({
      documentId,
      ydocRef,
      wsProviderRef,
      setConnected,
    });
  }, [documentId]);

  // Setup Awareness (Presence)
  useEffect(() => {
    if (!connected || !wsProviderRef.current || !userData) return;
    return setupAwareness({
      wsProvider: wsProviderRef.current,
      userData,
      setActiveUsers,
    });
  }, [userData, connected]);

  // Activate Hooks
  useActivityTracker({ wsProviderRef, userData });
  useTypingTracker({ editor, wsProviderRef, userData, setTypingUsers });

  // Initial Content Loader
  useEffect(() => {
    if (editor && initialContent) {
      // Only set content if empty to avoid overwriting collab state on re-mount
      if (editor.isEmpty) {
        editor.commands.setContent(initialContent, false);
      }
    }
  }, [initialContent, editor]);

  // --- 4. Handlers ---

  const handleNavigateToDocuments = useCallback(() => {
    router.push(`/collab/${collabId}/documents`);
  }, [router, collabId]);

  const saveDocument = useCallback(
    async ({ isAutoSave = false } = {}) => {
      if (!editor || !documentId || !collabId) {
        if (!isAutoSave) toast.error("Error: Editor not ready");
        return;
      }

      if (!isAutoSave) setIsSaving(true);

      try {
        const content = editor.getHTML();
        await saveDocumentToAPI({
          collabId,
          documentId,
          documentTitle,
          content,
          onSave,
          isAutoSave,
        });
        setLastSaved(new Date());
      } catch (error) {
        console.error("Save error:", error);
        if (!isAutoSave) toast.error("Failed to save");
      } finally {
        if (!isAutoSave) setIsSaving(false);
      }
    },
    [editor, documentId, collabId, documentTitle, onSave],
  );

  // Auto-Save
  useAutoSave({ editor, connected, saveDocument });

  // PDF Export
  const exportAsPDF = useCallback(() => {
    // Simple placeholder for robust PDF export if needed
    window.print();
  }, []);

  // Keyboard Shortcuts (Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveDocument();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saveDocument]);

  // --- 5. Render ---

  if (!editor) return <LoadingDisplay />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-full bg-[#FAFAFA] dark:bg-[#0A0A0A] overflow-hidden flex flex-col"
    >
      {/* subtle grid background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #6366f1 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* --- Top Layer: "Command Deck" --- */}
      {/* <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] flex flex-col relative"> */}
      <DocumentHeader
        documentTitle={documentTitle}
        setDocumentTitle={setDocumentTitle}
        connected={connected}
        isSaving={isSaving}
        saveDocument={saveDocument}
        exportDocument={exportAsPDF}
        navigateBack={handleNavigateToDocuments}
        userName={session?.user?.name}
      />
      <EditorToolbar editor={editor} />
      {/* </div> */}

      {/* --- Middle Layer: "Canvas" --- */}
      <div
        className="flex-1 overflow-y-auto custom-scrollbar relative z-0 flex justify-center py-20 px-4"
        onClick={() => editor.chain().focus().run()}
      >
        {/* Bubble Menu */}
        <EditorBubbleMenu editor={editor} />

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[900px] min-h-[1100px] bg-white dark:bg-[#121212] shadow-2xl shadow-black/10 dark:shadow-black/40 ring-1 ring-black/5 dark:ring-white/5 rounded-sm px-20 py-24 cursor-text"
        >
          <EditorContent
            editor={editor}
            className="prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[900px]"
          />
        </motion.div>
      </div>

      {/* --- Bottom Layer: "Mission Control" --- */}
      <EditorStatusHub
        editor={editor}
        activeUsers={activeUsers}
        typingUsers={typingUsers}
        lastSaved={lastSaved}
      />
    </motion.div>
  );
}
