"use client";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
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
import { FiLayout, FiMaximize2, FiX } from "react-icons/fi";
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
      className={`h-[100dvh] md:h-[calc(100vh-64px)] flex flex-col md:flex-row bg-background text-foreground overflow-hidden ${
        isEmbedded ? "h-full" : ""
      }`}
    >
      {/* Sidebar - Collapsible - HIDE IF EMBEDDED? No, we still need list of docs. 
          Maybe style it to fit better? 
          Actually, the outer shell has the global nav. The 'Documents' view DOES need a document list. 
          So we keep it, but maybe adjust height or styling. 
      */}
      {/* Sidebar - Collapsible (Desktop) / Overlay (Mobile) */}
      {/* NEW: Mobile Sidebar Portal Logic */}
      {typeof window !== "undefined" &&
        isSidebarOpen &&
        window.innerWidth < 1024 &&
        ReactDOM.createPortal(
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
              onClick={() => setIsSidebarOpen(false)}
            />
            {/* Sidebar Drawer */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-[#0A0A0A] border-r border-white/10 z-[10000] flex flex-col shadow-2xl"
            >
              {/* Close Button Mobile */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-white lg:hidden z-10 p-2"
              >
                <FiX size={20} />
              </button>

              <SidebarContent
                isMobile={true}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setIsCreatingDoc={setIsCreatingDoc}
                filteredDocuments={filteredDocuments}
                selectDocument={selectDocument}
                currentDocument={currentDocument}
                isAdmin={isAdmin}
                session={session}
                handleDeleteDocument={handleDeleteDocument}
              />
            </motion.aside>
          </>,
          document.body,
        )}

      {/* Desktop Sidebar (Relative) */}
      <motion.aside
        initial={{ width: 280, opacity: 1 }}
        animate={{
          width: isSidebarOpen ? 280 : 0,
          opacity: isSidebarOpen ? 1 : 0,
        }}
        className={`hidden lg:flex flex-shrink-0 border-r border-white/5 bg-background/80 backdrop-blur-xl z-20 flex-col overflow-hidden transition-all duration-300 ${
          isEmbedded ? "bg-background/90 border-r-0 lg:border-r" : ""
        }`}
      >
        <SidebarContent
          isMobile={false}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setIsCreatingDoc={setIsCreatingDoc}
          filteredDocuments={filteredDocuments}
          selectDocument={selectDocument}
          currentDocument={currentDocument}
          isAdmin={isAdmin}
          session={session}
          handleDeleteDocument={handleDeleteDocument}
        />
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative bg-gradient-to-br from-background via-background to-primary/5">
        {/* Toolbar / Breadcrumbs */}
        <header className="h-[64px] border-b border-white/5 bg-background/40 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {isSidebarOpen ? <FiX /> : <FiLayout />}
            </button>
            {currentDocument && (
              <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-hacker">
                  Editing
                </span>
                <span className="text-sm font-semibold truncate max-w-[200px] md:max-w-md">
                  {currentDocument.title}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsVideoCallActive(!isVideoCallActive)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-lg ${
                isVideoCallActive
                  ? "bg-destructive/10 text-destructive border border-destructive/20"
                  : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
              }`}
            >
              <FaVideo /> {isVideoCallActive ? "End Call" : "Connect"}
            </button>
          </div>
        </header>

        {/* Editor Container */}
        <div className="flex-1 overflow-hidden relative w-full">
          {currentDocument ? (
            <div className="h-full w-full overflow-y-auto p-4 flex justify-center custom-scrollbar">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full glass-card rounded-2xl shadow-2xl relative overflow-hidden ring-1 ring-white/10"
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
              <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
                No document selected
              </h3>
              <p className="text-sm opacity-60 max-w-xs text-center leading-relaxed font-mono">
                Select a file from the sidebar to view or edit, or create a new
                one using the button above.
              </p>
              <button
                onClick={() => setIsCreatingDoc(true)}
                className="mt-6 px-6 py-2.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-semibold shadow-lg hover:shadow-primary/15 hover:scale-105 transition-all"
              >
                Create New Doc
              </button>
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

      {/* Create Document Modal - Premium Spotlight Style */}
      <AnimatePresence>
        {isCreatingDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#0A0A0A] w-full max-w-lg p-1 rounded-2xl shadow-2xl ring-1 ring-white/10 relative overflow-hidden"
            >
              {/* Animated Border Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/20 opacity-50" />

              <div className="bg-card/90 backdrop-blur-xl relative rounded-xl p-8 overflow-hidden">
                {/* Spotlight Effect helper */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold font-hacker mb-1">
                      New Document
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Give your ideas a home.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCreatingDoc(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-white/5 rounded-full"
                  >
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleCreateDocument}>
                  <div className="mb-8">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block ml-1">
                      Title
                    </label>
                    <input
                      autoFocus
                      className="w-full p-4 font-geist-sans text-xl font-medium rounded-xl bg-muted/30 border border-white/5 focus:border-primary/50 focus:bg-muted/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/30"
                      placeholder="e.g. Project Roadmap 2024"
                      value={newDocTitle}
                      onChange={(e) => setNewDocTitle(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCreatingDoc(false)}
                      className="px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newDocTitle.trim()}
                      className="px-6 py-2.5 rounded-xl text-sm font-bold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create Document
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const SidebarContent = ({
  isMobile,
  searchQuery,
  setSearchQuery,
  setIsCreatingDoc,
  filteredDocuments,
  selectDocument,
  currentDocument,
  isAdmin,
  session,
  handleDeleteDocument,
}) => (
  <>
    {/* Sidebar Header */}
    <div className={`p-4 pt-6 min-w-[280px] ${isMobile ? "mt-8" : ""}`}>
      <h2 className="font-hacker text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4 px-1">
        Library
      </h2>

      {/* Search */}
      <div className="relative group mb-4">
        <FaSearch className="absolute left-3 top-3 text-muted-foreground group-focus-within:text-primary transition-colors text-xs" />
        <input
          type="text"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 text-sm bg-muted/30 border border-white/5 focus:border-primary/30 focus:bg-muted/50 rounded-lg outline-none transition-all placeholder:text-muted-foreground/50"
        />
      </div>

      {/* New Doc Button */}
      <button
        onClick={() => setIsCreatingDoc(true)}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all group"
      >
        <div className="p-1 rounded bg-primary text-primary-foreground group-hover:scale-110 transition-transform">
          <FaPlus size={10} />
        </div>
        <span className="text-sm font-semibold">New Document</span>
      </button>
    </div>

    {/* Doc List */}
    <div className="flex-1 overflow-y-auto min-w-[280px] px-3 pb-4 custom-scrollbar">
      <div className="space-y-1">
        {filteredDocuments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-xs text-muted-foreground italic">
              No documents found.
            </p>
          </div>
        )}
        <AnimatePresence>
          {filteredDocuments.map((doc) => (
            <motion.div
              key={doc._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={() => selectDocument(doc)}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 border border-transparent ${
                currentDocument?._id === doc._id
                  ? "bg-white/5 border-white/10 shadow-sm"
                  : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div
                  className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                    currentDocument?._id === doc._id
                      ? "bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg shadow-primary/20"
                      : "bg-muted/50 text-muted-foreground group-hover:bg-white/10 group-hover:text-foreground"
                  }`}
                >
                  <FaFileAlt className="text-xs" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span
                    className={`truncate text-sm font-medium ${
                      currentDocument?._id === doc._id ? "text-foreground" : ""
                    }`}
                    title={doc.title}
                  >
                    {doc.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate opacity-60">
                    {new Date(doc.updatedAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {(isAdmin || doc.createdBy === session?.user?.email) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteDocument(doc._id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                >
                  <FaTrashAlt size={12} />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  </>
);

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
