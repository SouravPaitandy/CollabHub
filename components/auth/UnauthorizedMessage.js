"use client";

import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";

export default function UnauthorizedMessage() {
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
        <h2 className="text-2xl font-bold mb-4">Unauthorized</h2>
        <p className="mb-6">You must be logged in to access this page.</p>
        <Link 
          href="/auth" 
          className="w-full px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg transition-all duration-200 font-medium flex items-center justify-center shadow-md hover:shadow-lg"
        >
          <FaArrowLeft className="mr-2" /> Return to Login Page
        </Link>
      </motion.div>
    </motion.div>
  );
}