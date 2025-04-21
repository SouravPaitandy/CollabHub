"use client";

import { React, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loader from "@/components/Loading";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCopy,
  FaCheck,
  FaShare,
  FaEnvelope,
  FaTrash,
  FaUsers,
  FaCog,
  FaChartBar,
  FaBell,
  FaUserPlus,
  FaUserMinus,
  FaArrowRight,
  FaLink,
  FaCalendarAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CollabAdminPanel({ params }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [collab, setCollab] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [removeParticipantId, setRemoveParticipantId] = useState(null);

  const id = params?.id;

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Invite code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
      console.error("Failed to copy: ", err);
    }
  };

  const shareInvite = async () => {
    const shareText = `Join our collaboration "${collab.name}" on CollabHub! Use invite code: ${collab.inviteCode}`;
    const shareUrl = `${window.location.origin}/join-create`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${collab.name} on CollabHub`,
          text: shareText,
          url: shareUrl,
        });
        toast.success("Successfully shared invitation!");
      } catch (error) {
        if (error.name !== "AbortError") {
          toast.error("Error sharing invitation");
          console.error("Error sharing:", error);
        }
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      await copyToClipboard(`${shareText}\n${shareUrl}`);
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail) {
      toast.warning("Please enter an email address");
      return;
    }
    setIsInviting(true);
    try {
      const response = await fetch(`/api/collab/${id}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      });
      
      if (response.ok) {
        toast.success(`Invitation sent to ${inviteEmail}!`);
        setInviteEmail("");
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to invite user");
      }
    } catch (error) {
      toast.error(error.message || "Failed to invite user");
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveParticipant = async (participantId) => {
    setRemoveParticipantId(participantId);
  };
  
  const confirmRemoveParticipant = async () => {
    if (!removeParticipantId) return;
    
    try {
      const response = await fetch(`/api/collab/${id}/participants/${removeParticipantId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        setParticipants(participants.filter(p => p._id !== removeParticipantId));
        toast.success("Participant removed successfully");
      } else {
        throw new Error("Failed to remove participant");
      }
    } catch (error) {
      toast.error(error.message || "Failed to remove participant");
    } finally {
      setRemoveParticipantId(null);
    }
  };

  const handleDeleteCollab = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/collab/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Collaboration deleted successfully");
        setTimeout(() => window.history.back(), 1500);
      } else {
        throw new Error("Failed to delete collaboration");
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete collaboration");
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchCollabData();
    }
  }, [session]);

  const fetchCollabData = async () => {
    try {
      const [collabResponse, participantsResponse] = await Promise.all([
        fetch(`/api/collab/${id}`),
        fetch(`/api/collab/${id}/participants`)
      ]);

      if (!collabResponse.ok || !participantsResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const collabData = await collabResponse.json();
      const participantsData = await participantsResponse.json();

      setCollab(collabData);

      if (Array.isArray(participantsData.participants)) {
        setParticipants(participantsData.participants);
      } else if (typeof participantsData.participants === "object" && participantsData.participants !== null) {
        setParticipants(Object.values(participantsData.participants));
      } else {
        console.error("Unexpected participants data format:", participantsData.participants);
        setParticipants([]);
      }
    } catch (err) {
      setError("Failed to load collaboration data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => setShowConfirmDelete(true);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  if (loading) return <Loader />;
  if (error) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center text-red-600 bg-red-100 dark:bg-red-900/30 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Error</h2>
        <p>{error}</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
  if (!collab) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Collaboration not found</h2>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <ToastContainer position="bottom-right" theme={theme === "dark" ? "dark" : "light"} />
      
      <div className="fixed -z-10 h-full w-full top-0 left-0">
        {theme === "dark" ? (
          <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
        ) : (
          <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>
        )}
      </div>
      
      <div className="container mx-auto px-4 py-8 pt-40">
        <motion.div
          className="max-w-5xl mx-auto bg-[#fffff1] dark:bg-gray-800 border border-indigo-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="md:w-64 bg-[#f7f7e6] dark:bg-gray-900 p-6">
              <motion.h1 
                className="text-2xl font-bold mb-6 text-[#4a6fa5] dark:text-blue-400"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {collab.name}
              </motion.h1>
              
              <motion.nav
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.button
                  variants={itemVariants}
                  onClick={() => setActiveTab("details")}
                  className={`w-full text-left py-3 px-4 rounded-lg mb-3 flex items-center transition-all duration-300 ${
                    activeTab === "details"
                      ? "bg-[#4a6fa5] text-white font-medium shadow-md"
                      : "hover:bg-[#e6e6d1] dark:hover:bg-gray-700"
                  }`}
                >
                  <FaCog className="mr-3" /> Details
                </motion.button>
                <motion.button
                  variants={itemVariants}
                  onClick={() => setActiveTab("participants")}
                  className={`w-full text-left py-3 px-4 rounded-lg mb-3 flex items-center transition-all duration-300 ${
                    activeTab === "participants"
                      ? "bg-[#4a6fa5] text-white font-medium shadow-md"
                      : "hover:bg-[#e6e6d1] dark:hover:bg-gray-700"
                  }`}
                >
                  <FaUsers className="mr-3" /> Participants
                </motion.button>
                <motion.button
                  variants={itemVariants}
                  onClick={() => setActiveTab("actions")}
                  className={`w-full text-left py-3 px-4 rounded-lg mb-3 flex items-center transition-all duration-300 ${
                    activeTab === "actions"
                      ? "bg-[#4a6fa5] text-white font-medium shadow-md"
                      : "hover:bg-[#e6e6d1] dark:hover:bg-gray-700"
                  }`}
                >
                  <FaChartBar className="mr-3" /> Actions
                </motion.button>
              </motion.nav>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-auto pt-6 border-t border-[#e6e6d1] dark:border-gray-700"
              >
                <Link
                  href={`/chat/${params.id}`}
                  className="w-full flex items-center justify-center bg-gradient-to-r from-[#4a6fa5] to-[#5a7fb5] hover:from-[#3a5a8c] hover:to-[#4a6fa5] text-white py-3 px-4 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                >
                  <FaArrowRight className="mr-2" />
                  Go to Chat
                </Link>
              </motion.div>
            </div>

            {/* Main content */}
            <div className="flex-grow p-6 md:p-8">
              <AnimatePresence mode="wait">
                {activeTab === "details" && (
                  <motion.section
                    key="details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <h2 className="text-2xl font-semibold mb-6 text-[#4a6fa5] dark:text-blue-300 flex items-center">
                      <FaCog className="mr-3" /> Collaboration Details
                    </h2>
                    
                    <div className="bg-[#f0f0e1] dark:bg-gray-700 p-6 rounded-xl shadow-inner">
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2 text-[#3a5a8c] dark:text-blue-300">Invite Code</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
                          <div className="flex-1 bg-white dark:bg-gray-600 px-4 py-2 rounded-lg font-mono border border-[#e6e6d1] dark:border-gray-500">
                            {collab.inviteCode}
                          </div>
                          <div className="flex sm:ml-4">
                            <motion.button
                              onClick={() => copyToClipboard(collab.inviteCode)}
                              className="mr-2 bg-[#4a6fa5] hover:bg-[#3a5a8c] text-white p-2.5 rounded-lg transition-colors duration-200 flex items-center"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              aria-label="Copy invite code"
                            >
                              {copied ? <FaCheck /> : <FaCopy />}
                            </motion.button>
                            <motion.button
                              onClick={shareInvite}
                              className="bg-[#4a6fa5] hover:bg-[#3a5a8c] text-white p-2.5 rounded-lg transition-colors duration-200 flex items-center"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              aria-label="Share invite"
                            >
                              <FaShare />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <FaCalendarAlt className="text-[#4a6fa5] dark:text-blue-300 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                            <p className="font-medium">{new Date(collab.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <FaUsers className="text-[#4a6fa5] dark:text-blue-300 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Participants</p>
                            <p className="font-medium">{participants.length} members</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <FaShieldAlt className="text-[#4a6fa5] dark:text-blue-300 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                            <p className="font-medium">Active</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.section>
                )}

                {activeTab === "participants" && (
                  <motion.section
                    key="participants"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <h2 className="text-2xl font-semibold mb-6 text-[#4a6fa5] dark:text-blue-300 flex items-center">
                      <FaUsers className="mr-3" /> Participants
                    </h2>
                    
                    {participants.length > 0 ? (
                      <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden">
                        <motion.ul 
                          className="divide-y divide-[#e6e6d1] dark:divide-gray-600"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {participants.map((participant) => (
                            <motion.li
                              key={participant._id}
                              variants={itemVariants}
                              className="p-4 flex items-center justify-between hover:bg-[#f7f7e6] dark:hover:bg-gray-600 transition duration-150 ease-in-out"
                            >
                              <div className="flex items-center">
                                <div className="w-10 h-10 mr-4 rounded-full border-2 border-[#4a6fa5] bg-[#f0f0e1] dark:bg-gray-600 overflow-hidden flex items-center justify-center">
                                  {participant.user.image ? (
                                    <img
                                      className="w-full h-full object-cover"
                                      alt={participant.user.name}
                                      src={participant.user.image}
                                    />
                                  ) : (
                                    <span className="text-lg font-semibold text-[#4a6fa5]">
                                      {participant.user.name[0].toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-700 dark:text-gray-300">
                                    {participant.user.name}
                                  </p>
                                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    {participant.user.email}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <span
                                  className={`px-3 py-1 rounded-full text-sm mr-2 ${
                                    participant.role === "ADMIN"
                                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200"
                                      : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                                  }`}
                                >
                                  {participant.role}
                                </span>
                                <motion.button 
                                  className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleRemoveParticipant(participant._id)}
                                >
                                  <FaUserMinus />
                                </motion.button>
                              </div>
                            </motion.li>
                          ))}
                        </motion.ul>
                      </div>
                    ) : (
                      <div className="text-center p-10 bg-white dark:bg-gray-700 rounded-xl shadow-lg">
                        <FaUsers className="mx-auto text-4xl text-gray-300 dark:text-gray-500 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">No participants found</p>
                      </div>
                    )}
                    
                    <div className="mt-6 bg-[#f0f0e1] dark:bg-gray-700 p-5 rounded-xl shadow-inner">
                      <h3 className="text-lg font-medium mb-4 text-[#3a5a8c] dark:text-blue-300">Invite new participant</h3>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <input
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="Enter email to invite"
                          className="w-full px-4 py-3 border border-[#e6e6d1] rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-[#4a6fa5] dark:focus:ring-blue-400 focus:border-transparent"
                        />
                        <motion.button
                          onClick={handleInviteUser}
                          disabled={isInviting}
                          className="w-full sm:w-auto whitespace-nowrap bg-[#5a7fb5] hover:bg-[#4a6fa5] text-white py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 flex items-center justify-center shadow-md hover:shadow-lg"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FaUserPlus className="mr-2" />
                          {isInviting ? "Inviting..." : "Invite User"}
                        </motion.button>
                      </div>
                    </div>
                  </motion.section>
                )}

                {activeTab === "actions" && (
                  <motion.section
                    key="actions"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <h2 className="text-2xl font-semibold mb-6 text-[#4a6fa5] dark:text-blue-300 flex items-center">
                      <FaChartBar className="mr-3" /> Admin Actions
                    </h2>
                    
                    <div className="space-y-6">
                      <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg">
                        <h3 className="text-lg font-medium mb-4 text-[#3a5a8c] dark:text-blue-300">Danger Zone</h3>
                        <p className="mb-4 text-gray-600 dark:text-gray-400">
                          Deleting this collaboration will permanently remove all associated data including messages and files.
                        </p>
                        <motion.button
                          onClick={handleDeleteClick}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full cursor-pointer bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
                        >
                          <FaTrash className="mr-2" />
                          Delete Collaboration
                        </motion.button>
                      </div>
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showConfirmDelete && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <h3 className="text-xl font-bold mb-4 text-red-600 flex items-center">
                <FaTrash className="mr-2" /> Confirm Deletion
              </h3>
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this collaboration? This action
                cannot be undone and all associated data will be permanently lost.
              </p>
              <div className="flex justify-end space-x-4">
                <motion.button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition duration-300 text-gray-800 dark:text-gray-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleDeleteCollab}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-300 flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Forever"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Remove participant confirmation modal */}
      <AnimatePresence>
        {removeParticipantId && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <h3 className="text-xl font-bold mb-4 text-red-600 flex items-center">
                <FaUserMinus className="mr-2" /> Remove Participant
              </h3>
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Are you sure you want to remove this participant from the collaboration?
              </p>
              <div className="flex justify-end space-x-4">
                <motion.button
                  onClick={() => setRemoveParticipantId(null)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition duration-300 text-gray-800 dark:text-gray-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={confirmRemoveParticipant}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-300 flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Remove Participant
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <hr className="my-8 border-t dark:border-indigo-300 opacity-20" />
      <footer className="py-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} CollabHub. All rights reserved.
        </p>
        <p className="text-5xl font-extrabold mt-2 opacity-40">
          <span className="text-indigo-600 dark:text-indigo-300">✨</span>
          <span className="text-gray-600 dark:text-gray-400">
            Made with ❤️ by the CollabHub Team
          </span>
        </p>
      </footer>
    </div>
  );
}

export default CollabAdminPanel;
