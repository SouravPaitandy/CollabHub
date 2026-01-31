import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, PlusCircle, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CreateJoinCollabModal({
  isOpen,
  onClose,
  initialTab = "create",
  initialInviteCode = "",
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [formData, setFormData] = useState({
    inviteCode: initialInviteCode,
    collabName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  useEffect(() => {
    if (initialInviteCode) {
      setFormData((prev) => ({ ...prev, inviteCode: initialInviteCode }));
    }
  }, [initialInviteCode, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint =
        type === "join" ? "/api/collab/join" : "/api/collab/create";
      const payload =
        type === "join"
          ? { inviteCode: formData.inviteCode }
          : { name: formData.collabName };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          type === "join"
            ? "Successfully joined collab!"
            : "Collab created successfully!",
        );
        window.location.href =
          type === "join"
            ? `/collab/${data.collabId}`
            : `/collab/admin/${data.collabId}`;
        onClose();
      } else {
        toast.error(
          data.message ||
            (type === "join"
              ? "Invalid invite code."
              : "Failed to create collab."),
        );
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
              <h2 className="text-xl font-bold">Collaborate & Create</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex justify-center p-6 pb-2">
              <div className="bg-muted p-1 rounded-full flex gap-1">
                <button
                  onClick={() => setActiveTab("join")}
                  className={`px-6 py-2 rounded-full font-medium transition-all text-sm flex items-center gap-2 ${
                    activeTab === "join"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Users className="w-4 h-4" /> Join
                </button>
                <button
                  onClick={() => setActiveTab("create")}
                  className={`px-6 py-2 rounded-full font-medium transition-all text-sm flex items-center gap-2 ${
                    activeTab === "create"
                      ? "bg-green-600 text-white shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <PlusCircle className="w-4 h-4" /> Create
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === "join" ? (
                  <motion.form
                    key="join"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={(e) => handleSubmit(e, "join")}
                    className="space-y-4"
                  >
                    <div className="text-center mb-6">
                      <p className="text-sm text-muted-foreground">
                        Enter an invite code to join an existing team.
                      </p>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        name="inviteCode"
                        value={formData.inviteCode}
                        onChange={handleChange}
                        placeholder="Paste invite code here..."
                        className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? (
                        "Joining..."
                      ) : (
                        <>
                          <Users className="w-4 h-4" /> Join Team
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="create"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={(e) => handleSubmit(e, "create")}
                    className="space-y-4"
                  >
                    <div className="text-center mb-6">
                      <p className="text-sm text-muted-foreground">
                        Start a new project and invite others.
                      </p>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        name="collabName"
                        value={formData.collabName}
                        onChange={handleChange}
                        placeholder="Project Name"
                        className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-green-500/50 outline-none"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? (
                        "Creating..."
                      ) : (
                        <>
                          <PlusCircle className="w-4 h-4" /> Create Project
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
