"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaPlus,
  FaSearch,
  FaFile,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/Loading";
import DocumentEditor from "./DocumentEditor";
import { toast } from "react-hot-toast";
// import { content } from "html2canvas/dist/types/css/property-descriptors/content";

export default function DocumentsPage({ collabId }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [collabInfo, setCollabInfo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [isScrolledToMainContent, setIsScrolledToMainContent] = useState(false);

  // Fetch collab info and documents
  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.email && collabId) {
        try {
          setLoading(true);

          // Fetch collaboration info
          const collabResponse = await fetch(`/api/collab/${collabId}`);
          if (!collabResponse.ok) {
            throw new Error("Failed to fetch collaboration");
          }
          const collabData = await collabResponse.json();
          setCollabInfo(collabData);
          setIsAdmin(collabData.userRole === "ADMIN");

          // Fetch documents
          const docsResponse = await fetch(`/api/collab/${collabId}/documents`);
          if (!docsResponse.ok) {
            throw new Error("Failed to fetch documents");
          }
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

  // Check if scroll position has reached main content
  useEffect(() => {
    const handleScroll = () => {
      const mainContent = document.querySelector(".main-content");
      if (!mainContent) return;
      
      const mainContentTop = mainContent.getBoundingClientRect().top;
      const isReached = mainContentTop <= 120;
      console.log("mainContentTop: ", mainContentTop)
      if (isReached !== isScrolledToMainContent) {
        setIsScrolledToMainContent(isReached);
        console.log("Reached main content:", isReached);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolledToMainContent]);

  // Select document to view/edit
  const selectDocument = async (doc) => {
    // First, set the basic document info to show something quickly
    setCurrentDocument(doc);

    try {
      // Show loading state
      const loadingToast = toast.loading("Loading document...");

      // Then fetch the full document
      const response = await fetch(
        `/api/collab/${collabId}/documents/${doc._id}`
      );

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (!response.ok) {
        throw new Error("Failed to fetch document content");
      }

      const fullDoc = await response.json();
      console.log("Fetched document:", fullDoc); // Debug the returned data

      // Update the current document with full content
      setCurrentDocument(fullDoc);
    } catch (error) {
      console.error("Error loading document:", error);
      toast.error("Failed to load document content");
    }
  };

  // Create new document
  const handleCreateDocument = async (e) => {
    e.preventDefault();

    if (!newDocTitle.trim()) {
      toast.error("Please enter a document title");
      return;
    }

    try {
      setIsCreatingDoc(true);

      const response = await fetch(`/api/collab/${collabId}/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newDocTitle,
          content: "<p>Start typing here...</p>",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create document");
      }

      const newDocument = await response.json();
      setDocuments([...documents, newDocument]);
      setNewDocTitle("");
      setIsCreatingDoc(false);
      toast.success("Document created successfully");

      // Open the new document
      setCurrentDocument(newDocument);
    } catch (error) {
      console.error("Error creating document:", error);
      toast.error("Failed to create document");
      setIsCreatingDoc(false);
    }
  };

  // Delete document
  const handleDeleteDocument = async (docId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/collab/${collabId}/documents/${docId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      setDocuments(documents.filter((doc) => doc._id !== docId));

      if (currentDocument && currentDocument._id === docId) {
        setCurrentDocument(null);
      }

      toast.success("Document deleted successfully");
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    }
  };

  // Handle document update after save
  const handleDocumentSaved = (title, content) => {
    // Update the documents list with the new title if it changed
    if (currentDocument && currentDocument.title !== title) {
      setDocuments(
        documents.map((doc) =>
          doc._id === currentDocument._id ? { ...doc, title } : doc
        )
      );
      setCurrentDocument({ ...currentDocument, title });
    }
  };

  // Filter documents by search query
  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading state
  if (status === "loading" || (loading && !collabInfo)) {
    return <Loader />;
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 p-8 rounded-xl shadow-lg max-w-md w-full border border-red-200 dark:border-red-800"
        >
          <h2 className="text-2xl font-bold mb-4">Error Loading Documents</h2>
          <p className="mb-6 text-red-500 dark:text-red-400">{error}</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.back()}
            className="w-full px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg transition-all duration-200 font-medium flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <FaArrowLeft className="mr-2" /> Return to Dashboard
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  // Not found state
  if (!collabInfo) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-300 p-8 rounded-xl shadow-lg max-w-md w-full border border-yellow-200 dark:border-yellow-800"
        >
          <h2 className="text-2xl font-bold mb-4">Collaboration Not Found</h2>
          <p className="mb-6">
            The collaboration you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have access to it.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.back()}
            className="w-full px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg transition-all duration-200 font-medium flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <FaArrowLeft className="mr-2" /> Return to Dashboard
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-8xl mx-auto p-4 md:p-8 py-8 md:py-12"
    >
    {/* Header with back link */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          {/* Breadcrumb navigation */}
          <nav className="flex mt-8 mb-4 text-sm">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <button 
              onClick={() => router.push(`/${session?.username}`)}
              className="inline-flex items-center text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
            >
              Dashboard
            </button>
          </li>
          {isAdmin && <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <button 
            onClick={() => router.push(`/collab/admin/${collabId}`)}
            className="inline-flex items-center text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
              >
            {collabInfo.name}
              </button>
            </div>
          </li>}
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">Documents</span>
            </div>
          </li>
            </ol>
          </nav>

          {/* <motion.button
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="group inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200 mb-4 font-medium text-lg"
            aria-label="Go back"
          >
            <FaArrowLeft className="mr-2 transform group-hover:translate-x-[-3px] transition-transform" />
            Back to Collaboration
          </motion.button> */}

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="border-b dark:border-gray-700 pb-5 mb-6"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Documents for {collabInfo.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl">
              Create and collaborate on documents in real-time
            </p>
          </div>
          {isAdmin && (
            <div className="mt-4 md:mt-0">
              <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 px-3 py-1 rounded-full text-sm font-medium">
            Admin Access
              </span>
            </div>
          )}
            </div>
          </motion.div>
        </motion.div>

        {/* Main content area */}
      <div className={`main-content ${isScrolledToMainContent ? 'lg:relative' : ""} flex flex-col lg:flex-row gap-6 lg:gap-8 lg:justify-between`}>
        {/* Sidebar with document list */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`lg:max-w-[280px] overflow-hidden ${isScrolledToMainContent ? 'lg:fixed top-28 z-30' : ''}`}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-4">
            <div className="flex mb-4 items-center justify-between">
              <h2 className="text-xl font-semibold">Documents</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCreatingDoc(true)}
                className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full"
              >
                <FaPlus />
              </motion.button>
            </div>

            {/* Search box */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 pl-9 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>

            {/* Document list */}
            <div className="space-y-2 max-h-[130px] lg:max-h-[60vh] overflow-y-auto">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <motion.div
                    key={doc._id}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-lg cursor-pointer flex items-center justify-between ${
                      currentDocument && currentDocument._id === doc._id
                        ? "bg-indigo-100 dark:bg-indigo-900/40"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => selectDocument(doc)}
                  >
                    <div className="flex items-center">
                      <FaFile className="text-indigo-500 dark:text-indigo-400 mr-2" />
                      <div className="truncate">
                        <p className="font-medium truncate">{doc.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(doc.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {(isAdmin || doc.createdBy === session?.user?.email) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDocument(doc._id);
                        }}
                        className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1"
                      >
                        <FaTrash size={14} />
                      </button>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {searchQuery
                    ? "No documents match your search"
                    : "No documents yet"}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {isScrolledToMainContent && <div className="lg:block hidden w-[258px] h-20"></div>}

        {/* Document editor area */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:width-full flex-1"
        >
          {currentDocument ? (
            <DocumentEditor
              key={currentDocument._id}
              documentId={currentDocument._id}
              collabId={collabId}
              initialContent={currentDocument.content}
              title={currentDocument.title}
              onSave={handleDocumentSaved}
            />
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-32 h-32 mb-4 opacity-60 text-indigo-400">
                <FaFile size={80} className="mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                No document selected
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
                Select a document from the sidebar or create a new one to start
                collaborating
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCreatingDoc(true)}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex items-center"
              >
                <FaPlus className="mr-2" /> Create New Document
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>

      {/* New document modal */}
      <AnimatePresence>
        {isCreatingDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-4">Create New Document</h2>
              <form onSubmit={handleCreateDocument}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Document Title
                  </label>
                  <input
                    type="text"
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    placeholder="Enter document title"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsCreatingDoc(false)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex items-center"
                    disabled={!newDocTitle.trim()}
                  >
                    <FaPlus className="mr-2" /> Create
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
