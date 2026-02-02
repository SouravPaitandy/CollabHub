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
import SpotlightCard from "@/components/ui/SpotlightCard";

function AdminPanel({ id }) {
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
    const shareText = `Join our collaboration "${collab.name}" on Coordly! Use invite code: ${collab.inviteCode}`;
    const shareUrl = `${window.location.origin}/dashboard?join=${collab.inviteCode}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${collab.name} on Coordly`,
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
      const response = await fetch(
        `/api/collab/${id}/participants/${removeParticipantId}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        setParticipants(
          participants.filter((p) => p._id !== removeParticipantId),
        );
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
        fetch(`/api/collab/${id}/participants`),
      ]);

      if (!collabResponse.ok || !participantsResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const collabData = await collabResponse.json();
      const participantsData = await participantsResponse.json();

      setCollab(collabData);

      if (Array.isArray(participantsData.participants)) {
        setParticipants(participantsData.participants);
      } else if (
        typeof participantsData.participants === "object" &&
        participantsData.participants !== null
      ) {
        setParticipants(Object.values(participantsData.participants));
      } else {
        console.error(
          "Unexpected participants data format:",
          participantsData.participants,
        );
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
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-600 bg-red-100 dark:bg-red-900/30 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  if (!collab)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Collaboration not found</h2>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  if (!session || !session.user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 bg-red-100 dark:bg-red-900/30 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-2 text-red-600">
            Access Denied
          </h2>
          <p className="mb-4">
            You do not have permission to access this page. It might be due to
            expired session, if so then please relogin to Continue.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Return to Dashboard
          </button>
          <button
            onClick={() => router.push("/auth")}
            className="ml-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Back to Login page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ToastContainer
        position="bottom-right"
        theme={
          theme === "dark" ||
          (theme === "system" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)
            ? "dark"
            : "light"
        }
      />

      <div className="fixed -z-10 h-full w-full top-0 left-0 bg-background overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-purple-500/10 blur-[120px] animate-pulse-slow delay-1000" />
        <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[140px] animate-pulse-slow delay-700" />
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.button
          onClick={() => window.history.back()}
          className="mb-4 ml-2 md:ml-0 flex items-center text-muted-foreground hover:text-foreground transition-colors duration-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ x: -3 }}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </motion.button>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
          {/* MOBILE ONLY: Top Navigation */}
          <div className="md:hidden space-y-4 mb-2">
            <h1 className="text-2xl font-bold text-foreground truncate aura-text-glow px-2">
              {collab.name}
            </h1>

            {/* Scrollable Tab Bar */}
            <div className="flex gap-2 overflow-x-auto pb-2 px-1 scrollbar-hide">
              <button
                onClick={() => setActiveTab("details")}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === "details"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-muted/50 text-muted-foreground border border-border"
                }`}
              >
                <FaCog className="inline mr-2" /> Details
              </button>
              <button
                onClick={() => setActiveTab("participants")}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === "participants"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-muted/50 text-muted-foreground border border-border"
                }`}
              >
                <FaUsers className="inline mr-2" /> Participants
              </button>
              <button
                onClick={() => setActiveTab("actions")}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === "actions"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-muted/50 text-muted-foreground border border-border"
                }`}
              >
                <FaChartBar className="inline mr-2" /> Actions
              </button>
            </div>

            <Link
              href={`/collab/${id}`}
              className="w-full flex items-center justify-center bg-secondary/80 text-foreground py-3 px-4 rounded-xl transition duration-300 shadow-sm border border-white/10 font-medium"
            >
              <FaArrowRight className="mr-2" />
              Enter Workspace
            </Link>
          </div>

          {/* Desktop Floating Sidebar */}
          <SpotlightCard
            className="hidden md:block md:w-72 rounded-2xl h-fit sticky top-16 overflow-hidden border-black/10 bg-white/40 dark:border-white/10 dark:bg-black/40 backdrop-blur-2xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-6">
              <motion.h1
                className="text-2xl font-bold mb-6 text-foreground truncate aura-text-glow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                title={collab.name}
              >
                {collab.name}
              </motion.h1>

              <nav className="space-y-2">
                <motion.button
                  onClick={() => setActiveTab("details")}
                  className={`w-full text-left py-3 px-4 rounded-xl flex items-center transition-all duration-300 ${
                    activeTab === "details"
                      ? "bg-primary/20 text-primary font-bold shadow-sm translate-x-1 border border-primary/20"
                      : "hover:bg-white/5 text-muted-foreground hover:text-foreground hover:translate-x-1"
                  }`}
                >
                  <FaCog className="mr-3" /> Details
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab("participants")}
                  className={`w-full text-left py-3 px-4 rounded-xl flex items-center transition-all duration-300 ${
                    activeTab === "participants"
                      ? "bg-primary/20 text-primary font-bold shadow-sm translate-x-1 border border-primary/20"
                      : "hover:bg-white/5 text-muted-foreground hover:text-foreground hover:translate-x-1"
                  }`}
                >
                  <FaUsers className="mr-3" /> Participants
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab("actions")}
                  className={`w-full text-left py-3 px-4 rounded-xl flex items-center transition-all duration-300 ${
                    activeTab === "actions"
                      ? "bg-primary/20 text-primary font-bold shadow-sm translate-x-1 border border-primary/20"
                      : "hover:bg-white/5 text-muted-foreground hover:text-foreground hover:translate-x-1"
                  }`}
                >
                  <FaChartBar className="mr-3" /> Actions
                </motion.button>
              </nav>

              <div className="mt-8 pt-6 border-t border-white/10">
                <Link
                  href={`/collab/${id}`}
                  className="w-full flex items-center justify-center bg-secondary/50 hover:bg-secondary/80 text-foreground py-3 px-4 rounded-xl transition duration-300 shadow-sm backdrop-blur-sm border border-white/5"
                >
                  <FaArrowRight className="mr-2" />
                  Enter Workspace
                </Link>
              </div>
            </div>
          </SpotlightCard>

          {/* Main Content Area */}
          <motion.div
            className="flex-1 glass-card rounded-2xl overflow-hidden min-h-[600px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="p-4 md:p-8 h-full">
              <AnimatePresence mode="wait">
                {activeTab === "details" && (
                  <motion.section
                    key="details"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl md:text-2xl font-bold mb-6 text-foreground flex items-center">
                      <FaCog className="mr-3 text-primary" /> Collaboration
                      Details
                    </h2>

                    <div className="grid gap-6">
                      {/* Invite Code Card */}
                      <div className="bg-muted/30 p-4 md:p-6 rounded-xl border border-border hover:border-primary/20 transition-colors">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                          Invite Code
                        </h3>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <code className="flex-1 bg-background px-4 py-3 rounded-lg font-mono text-lg border border-input text-foreground flex items-center truncate">
                            {collab.inviteCode}
                          </code>
                          <div className="flex gap-2">
                            <button
                              onClick={() => copyToClipboard(collab.inviteCode)}
                              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors flex items-center justify-center min-w-[3rem]"
                              aria-label="Copy"
                            >
                              {copied ? <FaCheck /> : <FaCopy />}
                            </button>
                            <button
                              onClick={shareInvite}
                              className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-colors flex items-center justify-center min-w-[3rem]"
                              aria-label="Share"
                            >
                              <FaShare />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Meta Data Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-muted/30 p-4 rounded-xl border border-border">
                          <div className="flex items-center text-muted-foreground mb-2">
                            <FaCalendarAlt className="mr-2" /> Created
                          </div>
                          <div className="font-semibold text-foreground">
                            {new Date(collab.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="bg-muted/30 p-4 rounded-xl border border-border">
                          <div className="flex items-center text-muted-foreground mb-2">
                            <FaUsers className="mr-2" /> Members
                          </div>
                          <div className="font-semibold text-foreground">
                            {participants.length} Active
                          </div>
                        </div>
                        <div className="bg-muted/30 p-4 rounded-xl border border-border">
                          <div className="flex items-center text-muted-foreground mb-2">
                            <FaShieldAlt className="mr-2" /> Status
                          </div>
                          <div className="font-semibold text-green-500">
                            Active
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.section>
                )}

                {activeTab === "participants" && (
                  <motion.section
                    key="participants"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl md:text-2xl font-bold mb-6 text-foreground flex items-center">
                      <FaUsers className="mr-3 text-primary" /> Team Members
                    </h2>

                    {/* Invite Input */}
                    <div className="mb-6 md:mb-8 bg-muted/30 p-1 rounded-xl border border-border flex items-center flex-col sm:flex-row gap-2 sm:gap-0">
                      <input
                        type="email"
                        placeholder="Invite by email..."
                        className="w-full sm:flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                      <button
                        onClick={handleInviteUser}
                        disabled={isInviting}
                        className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-all m-1 flex items-center justify-center disabled:opacity-50"
                      >
                        {isInviting ? "Sending..." : "Invite"}{" "}
                        <FaUserPlus className="ml-2" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {participants.map((participant) => (
                        <div
                          key={participant._id}
                          className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-background border border-border rounded-xl hover:border-primary/30 transition-all hover:shadow-sm gap-3"
                        >
                          <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg flex-shrink-0">
                              {participant.user.image ? (
                                <img
                                  src={participant.user.image}
                                  alt={participant.user.name}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                participant.user.name[0]
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-foreground truncate">
                                {participant.user.name}
                              </div>
                              <div className="text-sm text-muted-foreground truncate">
                                {participant.user.email}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between w-full sm:w-auto gap-3 pl-14 sm:pl-0">
                            <span
                              className={`px-2 py-1 rounded-md text-xs font-medium ${
                                participant.role === "ADMIN"
                                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                                  : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                              }`}
                            >
                              {participant.role}
                            </span>
                            {session.user.name !== participant.user.name && (
                              <button
                                onClick={() =>
                                  handleRemoveParticipant(participant._id)
                                }
                                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors sm:opacity-0 group-hover:opacity-100"
                                title="Remove member"
                              >
                                <FaUserMinus />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {activeTab === "actions" && (
                  <motion.section
                    key="actions"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl md:text-2xl font-bold mb-6 text-foreground flex items-center">
                      <FaChartBar className="mr-3 text-primary" /> Admin Actions
                    </h2>

                    <div className="border border-destructive/20 bg-destructive/5 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-destructive mb-2">
                        Danger Zone
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Once you delete a collaboration, there is no going back.
                        Please be certain.
                      </p>
                      <button
                        onClick={handleDeleteClick}
                        className="w-full sm:w-auto px-6 py-3 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl font-medium transition-all shadow-sm flex items-center justify-center"
                      >
                        <FaTrash className="mr-2" /> Delete Collaboration
                      </button>
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showConfirmDelete && (
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-card border border-border rounded-xl p-6 max-w-sm w-full shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <h3 className="text-xl font-bold mb-4 text-destructive flex items-center">
                <FaTrash className="mr-2 text-red-500" /> Confirm Deletion
              </h3>
              <p className="mb-6 text-muted-foreground">
                Are you sure you want to delete this collaboration? This action
                cannot be undone and all associated data will be permanently
                lost.
              </p>
              <div className="flex justify-end space-x-4">
                <motion.button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-4 py-2 bg-muted text-muted-foreground hover:bg-muted/80 rounded-lg transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleDeleteCollab}
                  className="px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg transition duration-300 flex items-center"
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
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-card border border-border rounded-xl p-6 max-w-sm w-full shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <h3 className="text-xl font-bold mb-4 text-destructive flex items-center">
                <FaUserMinus className="mr-2" /> Remove Participant
              </h3>
              <p className="mb-6 text-muted-foreground">
                Are you sure you want to remove this participant from the
                collaboration?
              </p>
              <div className="flex justify-end space-x-4">
                <motion.button
                  onClick={() => setRemoveParticipantId(null)}
                  className="px-4 py-2 bg-muted text-muted-foreground hover:bg-muted/80 rounded-lg transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={confirmRemoveParticipant}
                  className="px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg transition duration-300 flex items-center"
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
      <footer className="py-6 text-center text-sm">
        <p className="text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Coordly. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default AdminPanel;
