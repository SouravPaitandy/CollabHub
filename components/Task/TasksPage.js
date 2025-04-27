"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import TaskBoard from "./TaskBoard";
import { motion } from "framer-motion";
import Loader from "@/components/Loading";

export default function TasksPage( { collabId } )  {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [collabInfo, setCollabInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch collaboration info
  useEffect(() => {
    const fetchCollabInfo = async () => {
      if (session?.user?.email && collabId) {
        try {
          setLoading(true);
          const response = await fetch(`/api/collab/${collabId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch collaboration");
          }
          const data = await response.json();
          setCollabInfo(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };
  
    if (session?.user?.email && collabId) {
      fetchCollabInfo();
    }
  }, [session, collabId]);
  // Show loader only on initial data fetch, not during tab switches
  if (status === "loading" || (loading && !collabInfo && status !== "authenticated")) {
    return (<Loader />);
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
      className="max-w-7xl mx-auto p-5 md:p-8 py-10 md:py-16"
    >
      {/* Header with back link */}
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-10"
      >
        <motion.button 
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200 mb-6 font-medium text-lg"
          aria-label="Go back"
        >
          <FaArrowLeft className="mr-2" /> Back to Collaboration
        </motion.button>
        
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="border-b dark:border-gray-700 pb-6 mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800 dark:text-white">{collabInfo.name}</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">{collabInfo.description}</p>
        </motion.div>
      </motion.div>
      
      {/* Task Board Component with animation */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
      >
        <TaskBoard collabId={collabId} />
      </motion.div>
    </motion.div>
  );
}
