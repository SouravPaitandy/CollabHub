import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function EditProfileModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}) {
  const [formData, setFormData] = useState({
    bio: "",
    location: "",
    website: "",
    skills: [],
    socials: { twitter: "", linkedin: "", github: "" },
  });
  const [newSkill, setNewSkill] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        bio: initialData.bio || "",
        location: initialData.location || "",
        website: initialData.website || "",
        skills: initialData.skills || [],
        socials: {
          twitter: initialData.socials?.twitter || "",
          linkedin: initialData.socials?.linkedin || "",
          github: initialData.socials?.github || "",
        },
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("socials.")) {
      const socialKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socials: { ...prev.socials, [socialKey]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Save failed", error);
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
              <h2 className="text-xl font-bold">Edit Profile</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Bio */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  About Me
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-indigo-500/50 min-h-[100px] resize-y"
                  placeholder="Tell us a bit about yourself..."
                />
              </div>

              {/* Location & Website */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-indigo-500/50"
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-indigo-500/50"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Skills
                </label>
                <div className="flex flex-wrap gap-2 mb-2 p-3 rounded-xl bg-background border border-border min-h-[50px]">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1 px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSkill(e)}
                    className="flex-1 bg-transparent border-none focus:ring-0 min-w-[100px] text-sm"
                    placeholder="Add a skill & press Enter..."
                  />
                </div>
              </div>

              {/* Socials */}
              <div className="space-y-4 pt-4 border-t border-border/50">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Social Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    name="socials.github"
                    value={formData.socials.github}
                    onChange={handleChange}
                    placeholder="GitHub Username"
                    className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-indigo-500/50"
                  />
                  <input
                    name="socials.twitter"
                    value={formData.socials.twitter}
                    onChange={handleChange}
                    placeholder="Twitter Handle"
                    className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-indigo-500/50"
                  />
                  <input
                    name="socials.linkedin"
                    value={formData.socials.linkedin}
                    onChange={handleChange}
                    placeholder="LinkedIn URL"
                    className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-muted/30 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="px-6 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-500/20 flex items-center gap-2"
              >
                {isSaving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
