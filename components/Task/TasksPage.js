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
            onClick={() => router.refresh()}
            className="w-full px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg transition-all duration-200 font-medium flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <FaArrowLeft className="mr-2" /> Refresh Page
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
            onClick={() => router.refresh()}
            className="w-full px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg transition-all duration-200 font-medium flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <FaArrowLeft className="mr-2" /> Refresh Page
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
          className={`px-4 py-4 ${
            isEmbedded ? "max-w-full p-6 h-full" : "max-w-8xl mx-auto"
          }`}
        >
          {/* Task Board Component with animation */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`${
              isEmbedded
                ? "h-full bg-transparent overflow-hidden"
                : "rounded-3xl p-4 md:p-6 border border-white/5 bg-white/5 backdrop-blur-3xl shadow-2xl"
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
