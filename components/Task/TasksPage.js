"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import TaskBoard from "./TaskBoard";
import { motion } from "framer-motion";
import Loader from "@/components/Loading";
import Link from "next/link";

export default function TasksPage( { collabId, initialSession=null } )  {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [collabInfo, setCollabInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use provided session from server or client session
  const effectiveSession = session || initialSession;


// Add this state variable to store admin status
const [isAdmin, setIsAdmin] = useState(false);

// Demo mode detection
  const [isDemoMode, setIsDemoMode] = useState(false);

// Update your useEffect to check admin status
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
        // Check if current user is an admin
        const isUserAdmin = data.userRole === "ADMIN";
        setIsAdmin(isUserAdmin);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      // setError("Collaboration ID is required");
      setLoading(false);
    }
  };

  if (session?.user?.email && collabId) {
    fetchCollabInfo();
  }
}, [session, collabId]);

// Handle session changes or expiration
  useEffect(() => {
    // If session changes from valid to null, we're in demo mode
    if (status === "unauthenticated" && !isDemoMode) {
      setIsDemoMode(true);
    }
  }, [status, isDemoMode]);
  
  // Show loader only on initial data fetch, not during tab switches
  if (status === "loading" || (loading && !collabInfo && status !== "authenticated")) {
    return (<Loader />);
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
          <p className="mb-6">Your session has expired or you are not logged in. Please log in again to access this page.</p>
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
  // This prevents flickering when switching tabs
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
          <p className="mb-6">The collaboration you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.</p>
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
              onClick={() => router.push(`/${effectiveSession?.username}`)}
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
        
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="border-b dark:border-gray-700 pb-5 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {collabInfo.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl">
                {collabInfo.description}
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
      
      {/* Task Board Component with animation */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 md:p-6 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300"
      >
        <TaskBoard collabId={collabId} isAdmin={isAdmin}/>
      </motion.div>
    </motion.div>
  );
}
