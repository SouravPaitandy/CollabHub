"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
// import { io } from "socket.io-client"; // Removed
import { FaArrowLeft } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import TaskBoard from "./TaskBoard";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/Loading";
import Link from "next/link";
import Chat from "@/components/chat/Chat";
import {
  CollabProvider,
  useCollab,
} from "@/components/documents/CollabContext";

// Wrap the page component in the provider
export default function TasksPage({ collabId, initialSession = null }) {
  return (
    <CollabProvider collabId={collabId}>
      <TasksPageContent collabId={collabId} initialSession={initialSession} />
    </CollabProvider>
  );
}

export function TasksPageContent({
  collabId,
  initialSession = null,
  isEmbedded = false,
}) {
  const { data: session, status } = useSession();
  const { socket } = useCollab(); // Consume socket from context

  const router = useRouter();
  const [collabInfo, setCollabInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  // const [socket, setSocket] = useState(null); // Managed by Context now

  const effectiveSession = session || initialSession;
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // --- Main useEffect for Socket Listeners (Using Context Socket) ---
  useEffect(() => {
    if (!socket || !effectiveSession?.user?.email) return;

    // Listen for incoming messages for notifications
    const handleReceiveMessage = (message) => {
      setIsChatOpen((isOpen) => {
        if (!isOpen && message.sender.email !== effectiveSession?.user?.email) {
          setUnreadCount((count) => count + 1);
        }
        return isOpen;
      });
    };

    socket.on("receive_message", handleReceiveMessage);

    // Cleanup listeners
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, effectiveSession?.user?.email]);

  // Reset notifications when chat is opened
  useEffect(() => {
    if (isChatOpen) {
      setUnreadCount(0);
    }
  }, [isChatOpen]);

  // Fetch Collab Info
  useEffect(() => {
    const fetchCollabInfo = async () => {
      if (!effectiveSession?.user?.email) {
        setIsDemoMode(true);
        setLoading(false);
        return;
      }

      if (effectiveSession?.user?.email && collabId) {
        try {
          setLoading(true);
          const response = await fetch(`/api/collab/${collabId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch collaboration");
          }
          const data = await response.json();
          setCollabInfo(data);
          const isUserAdmin = data.userRole === "ADMIN";
          setIsAdmin(isUserAdmin);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    if (session?.user?.email && collabId) {
      fetchCollabInfo();
    }
  }, [session, collabId, effectiveSession]);

  useEffect(() => {
    if (status === "unauthenticated" && !isDemoMode) {
      setIsDemoMode(true);
    }
  }, [status, isDemoMode]);

  if (
    status === "loading" ||
    (loading && !collabInfo && status !== "authenticated")
  ) {
    return <Loader />;
  }

  // If session expired or we're in demo mode
  if (isDemoMode || (!effectiveSession && status !== "loading")) {
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
          <h2 className="text-2xl font-bold mb-4">Session Expired</h2>
          <p className="mb-6">
            Your session has expired or you are not logged in. Please log in
            again to access this page.
          </p>
          <Link
            href="/auth"
            className="w-full px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg transition-all duration-200 font-medium flex items-center justify-center shadow-md hover:shadow-lg"
          >
            Log In
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  // If we're authenticated but still loading data, don't reload the component
  if (loading && status === "authenticated" && collabInfo) {
    // Keep showing current content while background refresh happens
  }

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
          <h2 className="text-2xl font-bold mb-4">Error Loading Tasks</h2>
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
    <div className="relative w-full min-h-screen flex overflow-hidden">
      {/* Main Content Area */}
      <motion.div
        animate={{
          width: isChatOpen ? "calc(100% - 400px)" : "100%",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex-grow transition-all duration-300"
      >
        <div
          className={`p-4 md:p-8 py-8 md:py-12 ${
            isEmbedded ? "max-w-full p-6 h-full" : "max-w-8xl mx-auto"
          }`}
        >
          {/* Header with back link */}
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1 }}
            className={isEmbedded ? "mb-4" : "mb-8"}
          >
            {/* Breadcrumb navigation */}
            {!isEmbedded && (
              <nav className="flex mt-8 mb-4 text-sm">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                  <li className="inline-flex items-center">
                    <button
                      onClick={() =>
                        router.push(`/${effectiveSession?.username}`)
                      }
                      className="inline-flex items-center text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                    >
                      Dashboard
                    </button>
                  </li>
                  {isAdmin && (
                    <li>
                      <div className="flex items-center">
                        <span className="mx-2 text-gray-400">/</span>
                        <button
                          onClick={() =>
                            router.push(`/collab/admin/${collabId}`)
                          }
                          className="inline-flex items-center text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                        >
                          {collabInfo.name}
                        </button>
                      </div>
                    </li>
                  )}
                  <li>
                    <div className="flex items-center">
                      <span className="mx-2 text-gray-400">/</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                        Documents
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>
            )}

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="border-b dark:border-gray-700 pb-5 mb-6"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent filter drop-shadow-sm">
                    {isEmbedded ? "Project Tasks" : collabInfo.name}
                  </h1>
                  {!isEmbedded && (
                    <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl">
                      {collabInfo.description}
                    </p>
                  )}
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-4">
                  {/* Enhanced Chat Toggle Button - Hide in Embedded Mode */}
                  {!isEmbedded && (
                    <motion.button
                      // whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsChatOpen(true)}
                      className="relative group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg transition-all duration-300 border border-transparent hover:border-indigo-300 dark:hover:border-indigo-500"
                      aria-label="Open Team Chat"
                    >
                      {/* Icon container with glow effect */}
                      <div className="relative">
                        <FiMessageSquare className="w-5 h-5 transform transition-transform duration-200" />
                        {/* Subtle glow animation */}
                        <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
                      </div>

                      {/* Button text */}
                      <span className="text-sm font-semibold tracking-wide">
                        Team Chat
                      </span>

                      {/* Enhanced notification badge */}
                      <AnimatePresence>
                        {unreadCount > 0 && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0, rotate: -180 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0, opacity: 0, rotate: 180 }}
                            className="absolute -top-2 -right-2 min-w-6 h-6 px-1.5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-gray-800 shadow-lg"
                          >
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="leading-none"
                            >
                              {unreadCount > 99 ? "99+" : unreadCount}
                            </motion.span>

                            {/* Pulse animation for new messages */}
                            <motion.div
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                              className="absolute inset-0 rounded-full bg-red-400 opacity-30"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        {unreadCount > 0
                          ? `${unreadCount} new message${
                              unreadCount > 1 ? "s" : ""
                            }`
                          : "Open team chat"}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                      </div>
                    </motion.button>
                  )}

                  {isAdmin && (
                    <div className="mt-4 md:mt-0">
                      <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 px-3 py-1 rounded-full text-sm font-medium">
                        Admin Access
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Task Board Component with animation */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`${
              isEmbedded
                ? "h-full bg-transparent overflow-hidden"
                : "glass-card rounded-2xl p-4 md:p-6 shadow-2xl border border-white/10"
            } transition-all duration-300`}
          >
            <TaskBoard collabId={collabId} isAdmin={isAdmin} />
          </motion.div>
        </div>
      </motion.div>

      {/* Chat Sidebar NO LONGER needs socket passed */}
      <AnimatePresence>
        {isChatOpen && (
          <aside className="fixed top-0 right-0 h-full w-full max-w-md z-50">
            <Chat onClose={() => setIsChatOpen(false)} />
          </aside>
        )}
      </AnimatePresence>
    </div>
  );
}
