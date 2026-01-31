"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaPlus,
  FaSearch,
  FaFileAlt,
  FaTrashAlt,
  FaVideo,
  FaTimes,
  FaBars,
} from "react-icons/fa";
import { FiLayout, FiMaximize2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/Loading";
import DocumentEditor from "./DocumentEditor";
import { toast } from "react-hot-toast";
import VideoCall from "@/components/VideoCall";
import { CollabProvider } from "@/components/documents/CollabContext";

export default function DocumentsPage({ collabId }) {
  return (
    <CollabProvider collabId={collabId}>
      <DocumentsPageContent collabId={collabId} />
    </CollabProvider>
  );
}

export function DocumentsPageContent({ collabId, isEmbedded = false }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [collabInfo, setCollabInfo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // ... (state defs remain same)
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Toggle for mobile/desktop

  // Fetch Data logic... (remains same)
  useEffect(() => {
    const fetchData = async () => {
      // ... (fetch logic same)
      if (session?.user?.email && collabId) {
        try {
          setLoading(true);
          const collabResponse = await fetch(`/api/collab/${collabId}`);
          if (!collabResponse.ok)
            throw new Error("Failed to fetch collaboration");
          const collabData = await collabResponse.json();
          setCollabInfo(collabData);
          setIsAdmin(collabData.userRole === "ADMIN");

          const docsResponse = await fetch(`/api/collab/${collabId}/documents`);
          if (!docsResponse.ok) throw new Error("Failed to fetch documents");
          const docsData = await docsResponse.json();
          setDocuments(docsData);
        } catch (err) {
          console.error(err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [session, collabId]);

  // ... (rest of logic same)
  // Define helper functions here if needed or keep existing

  // Document Operations (same as before)
  const selectDocument = async (doc) => {
    setCurrentDocument(doc);
    try {
      // Optimistic set, but fetch full content
      const response = await fetch(
        `/api/collab/${collabId}/documents/${doc._id}`,
      );
      if (!response.ok) throw new Error("Failed to fetch content");
      const fullDoc = await response.json();
      setCurrentDocument(fullDoc);
      // On mobile, close sidebar after selection
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load document content");
    }
  };

  const handleCreateDocument = async (e) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return toast.error("Enter a title");

    try {
      setIsCreatingDoc(true);
      const response = await fetch(`/api/collab/${collabId}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newDocTitle,
          content: "<p>Start typing here...</p>",
        }),
      });

      if (!response.ok) throw new Error("Failed to create document");
      const newDocument = await response.json();
      setDocuments([...documents, newDocument]);
      setNewDocTitle("");
      setIsCreatingDoc(false);
      toast.success("Document created");
      selectDocument(newDocument);
    } catch (error) {
      toast.error("Failed to create document");
    } finally {
      setIsCreatingDoc(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm("Irreversible action. Delete this document?")) return;
    try {
      const response = await fetch(
        `/api/collab/${collabId}/documents/${docId}`,
        { method: "DELETE" },
      );
      if (!response.ok) throw new Error("Failed to delete");
      setDocuments(documents.filter((doc) => doc._id !== docId));
      if (currentDocument?._id === docId) setCurrentDocument(null);
      toast.success("Document deleted");
    } catch (error) {
      toast.error("Failed to delete document");
    }
  };

  const handleDocumentSaved = (title, content) => {
    if (currentDocument && currentDocument.title !== title) {
      setDocuments((docs) =>
        docs.map((d) => (d._id === currentDocument._id ? { ...d, title } : d)),
      );
      setCurrentDocument((prev) => ({ ...prev, title }));
    }
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (status === "loading" || (loading && !collabInfo)) return <Loader />;
  if (error) return <ErrorState error={error} onBack={() => router.back()} />;
  if (!collabInfo)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Collaboration Not Found
      </div>
    );

  return (
    <div
      className={`h-[calc(100vh-64px)] flex flex-col md:flex-row bg-background text-foreground overflow-hidden ${
        isEmbedded ? "h-full" : ""
      }`}
    >
      {/* Sidebar - Collapsible - HIDE IF EMBEDDED? No, we still need list of docs. 
          Maybe style it to fit better? 
          Actually, the outer shell has the global nav. The 'Documents' view DOES need a document list. 
          So we keep it, but maybe adjust height or styling. 
      */}
      <motion.aside
        initial={{ width: 280 }}
        animate={{
          width: isSidebarOpen ? 280 : 0,
          opacity: isSidebarOpen ? 1 : 0,
        }}
        className={`flex-shrink-0 border-r border-white/5 bg-background/30 backdrop-blur-xl z-20 flex flex-col overflow-hidden transition-all duration-300 ${
          isEmbedded ? "bg-transparent border-none" : ""
        }`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between min-w-[280px]">
          <h2 className="font-semibold text-lg truncate pr-2">
            {collabInfo.name}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsCreatingDoc(true)}
              className="p-2 rounded-md hover:bg-muted text-primary transition-colors"
              title="New Document"
            >
              <FaPlus />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 min-w-[280px]">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-muted-foreground text-xs" />
            <input
              type="text"
              placeholder="Search docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm bg-muted/50 border border-transparent focus:border-primary rounded-lg outline-none transition-all"
            />
          </div>
        </div>

        {/* Doc List */}
        <div className="flex-1 overflow-y-auto min-w-[280px] px-3 pb-4">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">
              Documents
            </h3>
            {filteredDocuments.length === 0 && (
              <p className="text-sm text-muted-foreground px-2 italic">
                No documents found.
              </p>
            )}
            {filteredDocuments.map((doc) => (
              <div
                key={doc._id}
                onClick={() => selectDocument(doc)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 border border-transparent ${
                  currentDocument?._id === doc._id
                    ? "bg-primary/15 text-primary font-medium border-primary/10 shadow-sm shadow-primary/5"
                    : "hover:bg-primary/5 text-foreground/70 hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div
                    className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors ${
                      currentDocument?._id === doc._id
                        ? "bg-primary/20 text-primary"
                        : "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    }`}
                  >
                    <FaFileAlt className="text-xs" />
                  </div>
                  <span className="truncate text-sm">{doc.title}</span>
                </div>
                {(isAdmin || doc.createdBy === session?.user?.email) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDocument(doc._id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                  >
                    <FaTrashAlt size={11} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative bg-gradient-to-br from-background via-background to-primary/5">
        {/* Toolbar / Breadcrumbs */}
        <header className="h-[64px] border-b border-white/5 bg-background/40 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-muted-foreground hover:text-foreground"
            >
              <FiLayout />
            </button>
            {currentDocument && (
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Editing</span>
                <span className="text-sm font-semibold">
                  {currentDocument.title}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsVideoCallActive(!isVideoCallActive)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                isVideoCallActive
                  ? "bg-destructive/10 text-destructive border border-destructive/20"
                  : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
              }`}
            >
              <FaVideo /> {isVideoCallActive ? "End Call" : "Video Call"}
            </button>
          </div>
        </header>

        {/* Editor Container */}
        <div className="flex-1 overflow-hidden relative w-full">
          {currentDocument ? (
            <div className="h-full w-full overflow-y-auto p-4 md:p-8 flex justify-center custom-scrollbar">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-[850px] glass-card rounded-2xl shadow-2xl min-h-[calc(100vh-180px)] relative overflow-hidden ring-1 ring-white/10"
              >
                {/* Decorative top gradient */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-purple-500/50 to-primary/50" />

                <DocumentEditor
                  key={currentDocument._id}
                  documentId={currentDocument._id}
                  collabId={collabId}
                  initialContent={currentDocument.content}
                  title={currentDocument.title}
                  onSave={handleDocumentSaved}
                />
              </motion.div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-primary/20 shadow-lg shadow-primary/5"
              >
                <FaFileAlt className="text-3xl text-primary/60" />
              </motion.div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
                No document selected
              </h3>
              <p className="text-sm opacity-60 max-w-xs text-center leading-relaxed">
                Select a file from the sidebar to view or edit, or create a new
                one to get started.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Video Call Overlay */}
      <AnimatePresence>
        {isVideoCallActive && (
          <VideoCall
            roomId={collabId}
            userName={session?.user?.name}
            onLeave={() => setIsVideoCallActive(false)}
          />
        )}
      </AnimatePresence>

      {/* Create Document Modal */}
      <AnimatePresence>
        {isCreatingDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card w-full max-w-md p-6 rounded-xl shadow-2xl border border-border"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">New Document</h3>
                <button
                  onClick={() => setIsCreatingDoc(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleCreateDocument}>
                <input
                  autoFocus
                  className="w-full p-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none transition-all mb-4"
                  placeholder="Document Title (e.g., Marketing Plan)"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingDoc(false)}
                    className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    Create Document
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const ErrorState = ({ error, onBack }) => (
  <div className="min-h-screen flex items-center justify-center p-4 bg-background">
    <div className="bg-destructive/5 border border-destructive/20 text-destructive p-8 rounded-xl max-w-md text-center">
      <p className="mb-4">{error}</p>
      <button
        onClick={onBack}
        className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90"
      >
        Go Back
      </button>
    </div>
  </div>
);
