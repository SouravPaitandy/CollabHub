"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Briefcase,
  CheckCircle2,
  clock,
  ArrowLeft,
  Github,
  MapPin,
  Globe,
  Edit2,
  Twitter,
  Linkedin,
} from "lucide-react";
import { format } from "date-fns";
import SpotlightCard from "@/components/ui/SpotlightCard";
import Loader from "@/components/Loading";
import EditProfileModal from "@/components/profile/EditProfileModal";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    highPriorityTasks: 0,
    tasksDueSoon: 0,
    collaborations: 0,
  });

  const [profileData, setProfileData] = useState({
    bio: "",
    location: "",
    website: "",
    skills: [],
    socials: {},
    accounts: [],
  });

  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Authentication Guard
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
  }, [status, router]);

  // Fetch Data
  useEffect(() => {
    if (session?.user) {
      const fetchData = async () => {
        try {
          // Fetch Tasks Stats
          const statsRes = await fetch("/api/user/task-stats");
          const statsData = await statsRes.json();

          // Fetch Collabs count
          const collabsRes = await fetch("/api/user/collabs");
          const collabsData = await collabsRes.json();

          // Fetch Rich Profile Data
          const profileRes = await fetch("/api/user/profile");
          if (profileRes.ok) {
            const profile = await profileRes.json();
            setProfileData(profile);
          }

          setStats({
            ...statsData,
            collaborations: collabsData.length || 0,
          });
        } catch (error) {
          console.error("Failed to fetch profile data", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [session]);

  const handleUpdateProfile = async (updatedData) => {
    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) throw new Error("Update failed");

    const resData = await res.json();
    toast.success("Profile updated!");

    // Refresh local state
    setProfileData((prev) => ({ ...prev, ...updatedData }));
  };

  if (status === "loading" || loading) {
    return <Loader />;
  }

  if (!session) return null;

  // Stagger animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={profileData}
        onSave={handleUpdateProfile}
      />

      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 font-medium text-sm"
          >
            <Edit2 className="w-4 h-4" /> Edit Profile
          </button>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* --- Left Column: Identity --- */}
          <motion.div variants={item} className="lg:col-span-4 space-y-6">
            <SpotlightCard className="p-8 text-center bg-card/50 backdrop-blur-xl border-border/50">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 blur-lg opacity-50 animate-pulse"></div>
                <Image
                  src={session.user.image || "/default-pic.png"}
                  alt={session.user.name}
                  width={128}
                  height={128}
                  className="rounded-full border-4 border-background relative z-10 w-full h-full object-cover"
                />
                <div
                  className="absolute bottom-1 right-1 z-20 w-6 h-6 bg-green-500 border-4 border-background rounded-full"
                  title="Online"
                ></div>
              </div>

              <h1 className="text-2xl font-bold aura-text-glow mb-2">
                {session.user.name}
              </h1>
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-4">
                <Mail className="w-4 h-4" />
                {session.user.email}
              </div>

              {/* Optional Fields Display */}
              <div className="space-y-3 mb-6">
                {profileData.location && (
                  <div className="flex items-center justify-center gap-2 text-sm text-foreground/80">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                    {profileData.location}
                  </div>
                )}
                {profileData.website && (
                  <a
                    href={profileData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-sm text-indigo-500 hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    {new URL(profileData.website).hostname}
                  </a>
                )}

                {/* Social Icons */}
                <div className="flex justify-center gap-3 mt-4">
                  {profileData.socials?.github && (
                    <a
                      href={`https://github.com/${profileData.socials.github}`}
                      target="_blank"
                      className="p-2 bg-muted rounded-full hover:bg-foreground hover:text-background transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {profileData.socials?.twitter && (
                    <a
                      href={`https://twitter.com/${profileData.socials.twitter}`}
                      target="_blank"
                      className="p-2 bg-muted rounded-full hover:bg-blue-400 hover:text-white transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {profileData.socials?.linkedin && (
                    <a
                      href={
                        profileData.socials.linkedin.startsWith("http")
                          ? profileData.socials.linkedin
                          : `https://linkedin.com/in/${profileData.socials.linkedin}`
                      }
                      target="_blank"
                      className="p-2 bg-muted rounded-full hover:bg-blue-700 hover:text-white transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-medium border border-indigo-500/20">
                  Pro Member
                </span>
                {profileData.accounts && profileData.accounts.length > 0 && (
                  <span
                    className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-medium border border-orange-500/20"
                    title="Linked Accounts"
                  >
                    {profileData.accounts.length} Linked
                  </span>
                )}
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6 bg-card/30 backdrop-blur-md border-border/30">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Account Details
              </h3>

              <div className="space-y-4">
                {/* Linked Providers */}
                <div className="flex flex-col gap-2 py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" />
                    Auth Providers
                  </span>
                  <div className="flex gap-2 mt-1">
                    {/* Always show current session provider */}
                    <div className="px-2 py-1 bg-muted rounded text-xs uppercase font-bold flex items-center gap-1">
                      {session.provider === "google" ? "Google" : "GitHub"}
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                    </div>
                    {/* Show other linked accounts */}
                    {profileData.accounts?.map(
                      (acc) =>
                        acc.provider !== session.provider && (
                          <div
                            key={acc.provider}
                            className="px-2 py-1 bg-muted rounded text-xs uppercase font-bold text-muted-foreground"
                          >
                            {acc.provider} (Linked)
                          </div>
                        ),
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">Joined</span>
                  </div>
                  <span className="text-sm font-medium">
                    {format(new Date(), "MMM yyyy")}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Role</span>
                  </div>
                  <span className="text-sm font-medium">
                    Full Stack Developer
                  </span>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* --- Right Column: Stats & Achievements --- */}
          <motion.div variants={item} className="lg:col-span-8 space-y-6">
            {/* Bio Section */}
            {profileData.bio && (
              <SpotlightCard className="p-6 bg-card/40 backdrop-blur-sm border-border/40">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  About Me
                </h3>
                <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {profileData.bio}
                </p>
              </SpotlightCard>
            )}

            {/* Skills Section */}
            {profileData.skills?.length > 0 && (
              <SpotlightCard className="p-6 bg-card/40 backdrop-blur-sm border-border/40">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Skills & Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-sm font-medium hover:bg-indigo-500/20 transition-colors cursor-default"
                    >
                      {skill}
                    </motion.div>
                  ))}
                </div>
              </SpotlightCard>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatsCard
                icon={<Briefcase className="w-5 h-5 text-indigo-500" />}
                label="Active Projects"
                value={stats.collaborations}
                trend="+2 this month"
              />
              <StatsCard
                icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                label="Completed Tasks"
                value={stats.completedTasks}
                trend="Top 10%"
              />
              <StatsCard
                icon={<Calendar className="w-5 h-5 text-orange-500" />}
                label="Pending Tasks"
                value={stats.totalTasks}
                trend="Due soon: 2"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function StatsCard({ icon, label, value, trend }) {
  return (
    <SpotlightCard className="p-6 bg-card/40 backdrop-blur-sm border-border/40 hover:border-primary/20 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg bg-background/50 ring-1 ring-border">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          {label}
        </div>
        {trend && (
          <div className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
            {trend}
          </div>
        )}
      </div>
    </SpotlightCard>
  );
}
