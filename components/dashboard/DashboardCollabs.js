import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FiSettings, FiMessageSquare, FiClipboard, FiExternalLink, FiUser, FiUsers, FiLayers, FiChevronLeft, FiChevronRight, FiFileText } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';

const DashboardCollabs = ({adminCollabs, memberCollabs, username}) => {

  console.log('username came:', username);
  // State for active tab
  const [activeTab, setActiveTab] = useState('admin'); // 'admin' or 'member'
  
  // State for pagination
  const [adminPage, setAdminPage] = useState(0);
  const [memberPage, setMemberPage] = useState(0);
  const itemsPerPage = 4; // Show 4 items per page (2x2 grid)
  
  // Calculate pagination
  const adminMaxPage = Math.max(0, Math.ceil(adminCollabs.length / itemsPerPage) - 1);
  const memberMaxPage = Math.max(0, Math.ceil(memberCollabs.length / itemsPerPage) - 1);
  
  // Get current page items
  const currentAdminCollabs = adminCollabs.slice(
    adminPage * itemsPerPage, 
    adminPage * itemsPerPage + itemsPerPage
  );
  
  const currentMemberCollabs = memberCollabs.slice(
    memberPage * itemsPerPage, 
    memberPage * itemsPerPage + itemsPerPage
  );
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100
      }
    }
  };

  const tabContentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 } 
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: { duration: 0.2 }
    }
  };

  // Pagination controls
  const nextAdminPage = () => {
    if (adminPage < adminMaxPage) setAdminPage(adminPage + 1);
  };
  
  const prevAdminPage = () => {
    if (adminPage > 0) setAdminPage(adminPage - 1);
  };
  
  const nextMemberPage = () => {
    if (memberPage < memberMaxPage) setMemberPage(memberPage + 1);
  };
  
  const prevMemberPage = () => {
    if (memberPage > 0) setMemberPage(memberPage - 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="rounded-2xl p-8 bg-gradient-to-b from-white to-indigo-50/30 dark:from-gray-800 dark:to-indigo-950/20 shadow-xl dark:shadow-2xl border border-indigo-100/50 dark:border-indigo-900/30"
    >
      <div className="flex items-center mb-6">
        <HiOutlineSparkles className="text-3xl text-indigo-600 dark:text-indigo-400 mr-3" />
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
          Your Collaborations
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center border-b border-gray-200 dark:border-gray-700 mb-6 pb-1">
        <button
          onClick={() => setActiveTab('admin')}
          className={`flex items-center py-3 px-4 font-medium text-sm transition-colors rounded-t-lg relative ${
            activeTab === 'admin'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          <FiLayers className="mr-2" />
          Projects You Manage
          <span className="ml-2 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 text-xs px-2 py-0.5 rounded-full">
            {adminCollabs.length}
          </span>
          
          {/* Active indicator */}
          {activeTab === 'admin' && (
            <motion.div 
              layoutId="activeTabIndicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" 
              initial={false}
            />
          )}
        </button>
        
        <button
          onClick={() => setActiveTab('member')}
          className={`flex items-center py-3 px-4 font-medium text-sm transition-colors rounded-t-lg relative ${
            activeTab === 'member'
              ? 'text-purple-600 dark:text-purple-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          <FiUsers className="mr-2" />
          Projects You&apos;ve Joined
          <span className="ml-2 bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 text-xs px-2 py-0.5 rounded-full">
            {memberCollabs.length}
          </span>
          
          {/* Active indicator */}
          {activeTab === 'member' && (
            <motion.div 
              layoutId="activeTabIndicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400" 
              initial={false}
            />
          )}
        </button>
      </div>

      {/* Tab Content Container */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {/* Admin Tab Content */}
          {activeTab === 'admin' && (
            <motion.div
              key="admin-content"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Pagination controls */}
              {adminCollabs.length > itemsPerPage && (
                <div className="flex justify-end mb-4">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={prevAdminPage}
                      disabled={adminPage === 0}
                      className={`p-1 rounded-full ${adminPage === 0 
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                        : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'}`}
                      aria-label="Previous page"
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {adminPage + 1}/{adminMaxPage + 1}
                    </span>
                    <button 
                      onClick={nextAdminPage}
                      disabled={adminPage >= adminMaxPage}
                      className={`p-1 rounded-full ${adminPage >= adminMaxPage 
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                        : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'}`}
                      aria-label="Next page"
                    >
                      <FiChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
              
              <div className="bg-white/80 dark:bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm shadow-inner min-h-[350px]">
                {adminCollabs.length > 0 ? (
                  <motion.div
                    key={`admin-page-${adminPage}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.ul 
                      className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {currentAdminCollabs.map((collab) => (
                        <motion.li
                          key={collab.collabId}
                          variants={itemVariants}
                          whileHover={{ scale: 1.02 }}
                          className="relative p-4 rounded-xl bg-gradient-to-br from-white to-indigo-50 dark:from-gray-700 dark:to-indigo-900/20 shadow-md hover:shadow-lg transition-all duration-300 border border-indigo-100/50 dark:border-indigo-800/30 overflow-hidden group"
                        >
                          {/* Background decoration */}
                          <div className="absolute -right-6 -top-6 w-16 h-16 bg-indigo-200/30 dark:bg-indigo-800/20 rounded-full z-0 transition-transform duration-300 group-hover:scale-150"></div>
                          
                          <div className="flex flex-col space-y-3 relative z-10">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center">
                                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 mr-3">
                                  <FiSettings className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                                    {collab.collabName}
                                  </div>
                                  <div className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 px-2 py-0.5 rounded-md inline-flex items-center">
                                    <FiUser className="mr-1" /> Admin
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-3">
                              <Link
                                href={`/collab/admin/${collab.collabId}`}
                                className="flex-1 flex items-center justify-center text-sm px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-200"
                              >
                                <FiSettings className="mr-2" /> Manage
                              </Link>
                              <Link
                                href={`/chat/${collab.collabId}`}
                                className="flex items-center justify-center text-sm px-3 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-800/60 text-blue-700 dark:text-blue-300 transition-colors duration-200"
                              >
                                <FiMessageSquare className="mr-2" /> Chat
                              </Link>
                              <Link
                                href={`/collab/${collab.collabId}`}
                                className="flex items-center justify-center text-sm px-3 py-2 rounded-lg bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/40 dark:hover:bg-purple-800/60 text-purple-700 dark:text-purple-300 transition-colors duration-200"
                              >
                                <FiClipboard className="mr-2" /> Tasks
                              </Link>
                              {/* This is for the test purpose only */}
                              { username === 'SouravPaitandy' && <Link
                                href={`/collab/documents/${collab.collabId}`}
                                className="flex items-center justify-center text-sm px-3 py-2 rounded-lg bg-green-100 hover:bg-green-200 dark:bg-green-900/40 dark:hover:bg-green-800/60 text-green-700 dark:text-green-300 transition-colors duration-200"
                              >
                                <FiFileText className="mr-2" /> Documents
                              </Link> }
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div>
                ) : (
                  <div className="text-center py-12">
                    <FiSettings className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-600 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      You&apos;re not managing any collaborations yet
                    </p>
                    <Link
                      href="/collab/join-create"
                      className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <FiExternalLink className="mr-1" /> Create your first project
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Member Tab Content */}
          {activeTab === 'member' && (
            <motion.div
              key="member-content"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Pagination controls */}
              {memberCollabs.length > itemsPerPage && (
                <div className="flex justify-end mb-4">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={prevMemberPage}
                      disabled={memberPage === 0}
                      className={`p-1 rounded-full ${memberPage === 0 
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                        : 'text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30'}`}
                      aria-label="Previous page"
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {memberPage + 1}/{memberMaxPage + 1}
                    </span>
                    <button 
                      onClick={nextMemberPage}
                      disabled={memberPage >= memberMaxPage}
                      className={`p-1 rounded-full ${memberPage >= memberMaxPage 
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                        : 'text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30'}`}
                      aria-label="Next page"
                    >
                      <FiChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
              
              <div className="bg-white/80 dark:bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm shadow-inner min-h-[350px]">
                {memberCollabs.length > 0 ? (
                  <motion.div
                    key={`member-page-${memberPage}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.ul 
                      className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {currentMemberCollabs.map((collab) => (
                        <motion.li
                          key={collab.collabId}
                          variants={itemVariants}
                          whileHover={{ scale: 1.02 }}
                          className="relative p-4 rounded-xl bg-gradient-to-br from-white to-purple-50 dark:from-gray-700 dark:to-purple-900/20 shadow-md hover:shadow-lg transition-all duration-300 border border-purple-100/50 dark:border-purple-800/30 overflow-hidden group"
                        >
                          {/* Background decoration */}
                          <div className="absolute -right-6 -top-6 w-16 h-16 bg-purple-200/30 dark:bg-purple-800/20 rounded-full z-0 transition-transform duration-300 group-hover:scale-150"></div>
                          
                          <div className="flex flex-col space-y-3 relative z-10">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center">
                                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 mr-3">
                                  <FiUsers className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                                    {collab.collabName}
                                  </div>
                                  <div className="text-xs bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 rounded-md inline-flex items-center">
                                    <FiUser className="mr-1" /> Member
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-3">
                              <Link
                                href={`/chat/${collab.collabId}`}
                                className="flex-1 flex items-center justify-center text-sm px-3 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-800/60 text-blue-700 dark:text-blue-300 transition-colors duration-200"
                              >
                                <FiMessageSquare className="mr-2" /> Chat
                              </Link>
                              <Link
                                href={`/collab/${collab.collabId}`}
                                className="flex-1 flex items-center justify-center text-sm px-3 py-2 rounded-lg bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/40 dark:hover:bg-purple-800/60 text-purple-700 dark:text-purple-300 transition-colors duration-200"
                              >
                                <FiClipboard className="mr-2" /> Tasks
                              </Link>
                              {/* This is for the test purpose only */}
                              { username === 'SouravPaitandy' && <Link
                                href={`/collab/documents/${collab.collabId}`}
                                className="flex items-center justify-center text-sm px-3 py-2 rounded-lg bg-green-100 hover:bg-green-200 dark:bg-green-900/40 dark:hover:bg-green-800/60 text-green-700 dark:text-green-300 transition-colors duration-200"
                              >
                                <FiFileText className="mr-2" /> Documents
                              </Link> }
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div>
                ) : (
                  <div className="text-center py-12">
                    <FiUsers className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-600 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      You haven&apos;t joined any collaborations yet
                    </p>
                    <Link
                      href="/collab/join-create"
                      className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      <FiExternalLink className="mr-1" /> Join a project with an invite code
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DashboardCollabs;