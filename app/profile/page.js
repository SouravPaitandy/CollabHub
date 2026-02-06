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
  Clock,
  ArrowLeft,
  MapPin,
  Edit2,
  Zap,
  Activity,
  Cpu,
  Terminal,
} from "lucide-react";
import { FaGithub, FaGlobe, FaLinkedin, FaTwitter } from "react-icons/fa";
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
          const statsRes = await fetch("/api/user/task-stats");
          const statsData = await statsRes.json();

          const collabsRes = await fetch("/api/user/collabs");
          const collabsData = await collabsRes.json();

          const profileRes = await fetch("/api/user/profile");
          if (profileRes.ok) {
            const profile = await profileRes.json();
            setProfileData(profile);
            console.log("profileData: ", profile);
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
    setProfileData((prev) => ({ ...prev, ...updatedData }));
  };

  if (status === "loading" || loading) {
    return <Loader />;
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden selection:bg-indigo-500/30">
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={profileData}
        onSave={handleUpdateProfile}
      />

      {/* Deep Space Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        {/* Navigation Head */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-hacker text-xs uppercase tracking-widest">
              Return to Base
            </span>
          </button>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 rounded-lg transition-all group"
          >
            <Edit2 className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
            <span className="font-hacker text-xs uppercase tracking-widest text-zinc-300 group-hover:text-white">
              Edit Profile
            </span>
          </button>
        </motion.div>

        {/* Hero Identity Section */}
        <div className="relative mb-8 group">
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 rounded-[2rem] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-1000" />

          <SpotlightCard className="relative p-10 md:p-14 rounded-[2rem] bg-black/60 border border-white/10 backdrop-blur-3xl flex flex-col md:flex-row items-center gap-10 md:gap-16 overflow-hidden">
            {/* Holographic Scanner Effect */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] mix-blend-overlay" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent blur-sm animate-scan" />

            {/* Avatar HUD */}
            <div className="relative shrink-0 group/avatar">
              {/* Rotating Rings */}
              <div className="absolute inset-[-20%] border border-indigo-500/20 rounded-full animate-spin-slow w-[140%] h-[140%] -top-[20%] -left-[20%] border-dashed" />
              <div className="absolute inset-[-10%] border border-purple-500/30 rounded-full animate-reverse-spin w-[120%] h-[120%] -top-[10%] -left-[10%]" />

              <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full p-1.5 bg-black ring-1 ring-white/10 shadow-2xl shadow-indigo-500/20">
                <Image
                  src={session.user.image || "/default-pic.png"}
                  alt={session.user.name}
                  fill
                  className="object-cover rounded-full grayscale group-hover/avatar:grayscale-0 transition-all duration-500"
                />
              </div>

              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/90 border border-emerald-500/50 rounded-full flex items-center gap-2 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] font-hacker">
                  SESSIONS ONLINE
                </span>
              </div>
            </div>

            {/* Identity Data */}
            <div className="flex-1 text-center md:text-left relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold font-hacker uppercase tracking-widest mb-4">
                <User className="w-3 h-3" />
                <span>Commandant • Level 1</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black font-hacker text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500 tracking-tight uppercase mb-2 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                {session.user.name}
              </h1>

              <div className="flex flex-col md:flex-row items-center gap-6 mt-6">
                {/* Metadata Pills */}
                <div className="flex items-center gap-3 text-sm font-mono text-zinc-400">
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-zinc-500" />
                    {session.user.email}
                  </span>
                  <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                  {profileData.location && (
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                      <MapPin className="w-3.5 h-3.5 text-purple-400" />
                      {profileData.location}
                    </div>
                  )}
                  {profileData.joinedDate && (
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      Joined{" "}
                      {format(new Date(profileData.joinedDate), "MMM yyyy")}
                    </div>
                  )}
                </div>
              </div>

              {/* Social Frequency Array */}
              <div className="h-8 w-px bg-white/10 hidden md:block" />

              <div className="flex items-center gap-2">
                {Object.entries(profileData.socials || {}).map(
                  ([platform, handle]) => {
                    if (!handle) return null;
                    const Icon =
                      platform === "github"
                        ? FaGithub
                        : platform === "twitter"
                          ? FaTwitter
                          : platform === "linkedin"
                            ? FaLinkedin
                            : Globe;
                    const url =
                      platform === "linkedin" && !handle.startsWith("http")
                        ? `https://linkedin.com/in/${handle}`
                        : platform === "github"
                          ? `https://github.com/${handle}`
                          : platform === "twitter"
                            ? `https://twitter.com/${handle}`
                            : handle;

                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-white/10"
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    );
                  },
                )}
              </div>
            </div>
            {/* </div> */}

            {/* Decorative Tech Elements */}
            <div className="absolute top-6 right-6 flex flex-col items-end gap-1 opacity-20">
              <div className="w-24 h-1 bg-white" />
              <div className="w-16 h-1 bg-white" />
              <div className="text-[10px] font-hacker text-white mt-1">
                ID: {session.user.email.split("@")[0].toUpperCase()}
              </div>
            </div>
          </SpotlightCard>
        </div>

        {/* Mission Control Grid (Bento) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Bio / Personnel File */}
          <div className="md:col-span-2">
            <SpotlightCard className="h-full p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <Terminal className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold font-hacker text-white uppercase tracking-widest">
                  Personnel File
                </h3>
              </div>
              <div className="flex-1 bg-black/20 rounded-xl p-6 border border-white/5 font-mono text-sm text-zinc-300 leading-relaxed overflow-y-auto max-h-[200px] scrollbar-hide">
                {profileData.bio ? (
                  profileData.bio
                ) : (
                  <span className="text-zinc-600 italic">
                    \// No bio data initialized...
                  </span>
                )}
              </div>
            </SpotlightCard>
          </div>

          {/* 2. Primary Stats */}
          <div className="md:col-span-1 space-y-6">
            <StatModule
              icon={Briefcase}
              label="Active Missions"
              value={stats.collaborations}
              color="text-cyan-400"
              bg="bg-cyan-500/10"
              border="border-cyan-500/20"
            />
            <StatModule
              icon={CheckCircle2}
              label="Tasks Executed"
              value={stats.completedTasks}
              color="text-emerald-400"
              bg="bg-emerald-500/10"
              border="border-emerald-500/20"
            />
            <StatModule
              icon={Activity}
              label="Pending Ops"
              value={stats.totalTasks}
              color="text-orange-400"
              bg="bg-orange-500/10"
              border="border-orange-500/20"
            />
          </div>

          {/* 3. Skill Matrices */}
          <div className="md:col-span-2">
            <SpotlightCard className="h-full p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <Cpu className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold font-hacker text-white uppercase tracking-widest">
                  Capability Matrix
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {profileData.skills?.length > 0 ? (
                  profileData.skills.map((skill, i) => (
                    <div
                      key={i}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 rounded-lg text-xs font-mono text-zinc-300 transition-all cursor-default flex items-center gap-2 group"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:animate-pulse" />
                      {skill}
                    </div>
                  ))
                ) : (
                  <span className="text-zinc-600 font-mono text-xs">
                    \// No capabilities modules loaded
                  </span>
                )}
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 border-dashed rounded-lg text-xs font-mono text-indigo-400 transition-all flex items-center gap-2"
                >
                  + Add Module
                </button>
              </div>
            </SpotlightCard>
          </div>

          {/* 4. Credentials / Accounts */}
          <div className="md:col-span-1">
            <SpotlightCard className="h-full p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-5 h-5 text-zinc-400" />
                <h3 className="text-sm font-bold font-hacker text-white uppercase tracking-widest">
                  Security Clearance
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg">
                      {session.provider === "github" ? (
                        <FaGithub className="w-4 h-4 text-white" />
                      ) : (
                        <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-full" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase">
                        {session.provider}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        Primary Uplink
                      </div>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                {profileData.accounts?.map(
                  (acc) =>
                    acc.provider !== session.provider && (
                      <div
                        key={acc.provider}
                        className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/5 rounded-lg">
                            <Shield className="w-4 h-4 text-zinc-400" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-zinc-300 uppercase">
                              {acc.provider}
                            </div>
                            <div className="text-[10px] text-zinc-500 font-mono">
                              Secondary Link
                            </div>
                          </div>
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono">
                          LINKED
                        </div>
                      </div>
                    ),
                )}
              </div>
            </SpotlightCard>
          </div>
        </div>
      </div>
      {/* 4. Footer Info */}
      <div className="py-4 text-center text-xs text-muted-foreground/40 uppercase">
        <p>
          <span className="font-geist-sans">©</span> {new Date().getFullYear()}{" "}
          Coordly
        </p>
        <p className="mt-1">Crafted for the community</p>
      </div>
    </div>
  );
}

function StatModule({ icon: Icon, label, value, color, bg, border }) {
  return (
    <SpotlightCard
      className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${bg} ${border} backdrop-blur-md flex items-center gap-4 group hover:scale-[1.02] transition-transform`}
    >
      <div className={`p-3 rounded-xl bg-black/20 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-2xl font-black font-hacker text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/50 transition-all">
          {value}
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 font-hacker">
          {label}
        </div>
      </div>
    </SpotlightCard>
  );
}
