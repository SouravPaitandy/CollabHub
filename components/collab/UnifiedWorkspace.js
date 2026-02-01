"use client";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  CheckSquare,
  MessageSquare,
  Video,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";
import { CollabProvider } from "@/components/documents/CollabContext";
import { DocumentsPageContent } from "@/components/documents/DocumentPage";
import { TasksPageContent } from "@/components/Task/TasksPage";
import Chat from "@/components/chat/Chat";
import VideoCall from "@/components/VideoCall";
import Loader from "@/components/Loading";

export default function UnifiedWorkspace({ collabId }) {
  return (
    <CollabProvider collabId={collabId}>
      <WorkspaceShell collabId={collabId} />
    </CollabProvider>
  );
}

function WorkspaceShell({ collabId }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();

  const [activeView, setActiveView] = useState(() => {
    const view = searchParams.get("view");
    return view === "tasks" || view === "settings" ? view : "docs";
  });
  const [isChatOpen, setIsChatOpen] = useState(
    searchParams.get("view") === "chat",
  );
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [collabName, setCollabName] = useState("Loading...");

  // Fetch Collab Name
  useEffect(() => {
    const fetchCollab = async () => {
      try {
        const res = await fetch(`/api/collab/${collabId}`);
        if (res.ok) {
          const data = await res.json();
          setCollabName(data.name);
        }
      } catch (err) {
        console.error("Failed to fetch collab info", err);
      }
    };
    if (collabId) fetchCollab();
  }, [collabId]);

  if (status === "loading") return <Loader />;
  if (status === "unauthenticated") {
    router.push("/auth");
    return null;
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      {/* --- Cosmic Background --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px]" />
      </div>

      {/* --- Global Navigation Rail --- */}
      <motion.nav
        initial={{ width: 80 }}
        animate={{ width: isSidebarCollapsed ? 80 : 260 }}
        className="z-50 h-full glass border-r border-white/5 flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out relative group"
      >
        {/* Logo / Header */}
        <div className="p-4 flex items-center gap-3 h-20 border-b border-white/5">
          <div className="relative w-10 h-10 shrink-0">
            <Image
              src="/favicon.png"
              alt="Logo"
              fill
              className="object-contain drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]"
            />
          </div>
          <AnimatePresence>
            {!isSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h1 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 truncate w-32">
                  {collabName}
                </h1>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute -right-3 top-8 bg-card border border-border rounded-full p-1 text-muted-foreground hover:text-primary transition-colors shadow-lg opacity-0 group-hover:opacity-100"
          >
            {isSidebarCollapsed ? (
              <ChevronRight size={14} />
            ) : (
              <ChevronLeft size={14} />
            )}
          </button>
        </div>

        {/* Main Nav Items */}
        <div className="flex-1 py-6 flex flex-col gap-2 px-3">
          <NavButton
            icon={<FileText size={22} />}
            label="Documents"
            isActive={activeView === "docs"}
            isCollapsed={isSidebarCollapsed}
            onClick={() => setActiveView("docs")}
          />
          <NavButton
            icon={<CheckSquare size={22} />}
            label="Tasks"
            isActive={activeView === "tasks"}
            isCollapsed={isSidebarCollapsed}
            onClick={() => setActiveView("tasks")}
          />
          <div className="my-4 border-t border-white/5 mx-2" />
          <NavButton
            icon={<MessageSquare size={22} />}
            label="Team Chat"
            isActive={isChatOpen}
            isCollapsed={isSidebarCollapsed}
            onClick={() => setIsChatOpen(!isChatOpen)}
            alertColor="bg-blue-500" // Can add logic for unread count here
          />
          <NavButton
            icon={<Video size={22} />}
            label="Video Call"
            isActive={isVideoOpen}
            isCollapsed={isSidebarCollapsed}
            onClick={() => setIsVideoOpen(!isVideoOpen)}
            alertColor={isVideoOpen ? "bg-green-500 animate-pulse" : ""}
          />
        </div>

        {/* User / Bottom Actions */}
        <div className="p-4 border-t border-white/5 flex flex-col gap-2">
          <NavButton
            icon={<Settings size={20} />}
            label="Settings"
            isActive={activeView === "settings"}
            isCollapsed={isSidebarCollapsed}
            onClick={() => router.push(`/collab/admin/${collabId}`)}
            variant="ghost"
          />
          {session.user.image ? (
            <button
              title="Go to Dashboard"
              className="cursor-pointer flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              onClick={() => router.push("/dashboard")}
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/10">
                <Image
                  src={session.user.image}
                  alt={session.user.name}
                  fill
                  className="object-cover"
                />
              </div>
              {!isSidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm font-medium truncate w-32">
                    {session.user.name}
                  </p>
                </motion.div>
              )}
            </button>
          ) : null}
        </div>
      </motion.nav>

      {/* --- Main Stage --- */}
      <main className="flex-1 h-full relative overflow-hidden flex flex-col">
        {/* Content Views */}
        <div className="flex-1 relative z-10 w-full h-full overflow-hidden">
          <AnimatePresence mode="wait">
            {activeView === "docs" && (
              <motion.div
                key="docs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full h-full"
              >
                {/* We pass a stripped interface to DocumentsPageContent to hide its internal sidebar if needed, 
                       or we just let it render full width. 
                       Currently DocumentPage has its own Sidebar. 
                       In unified mode, we might want to keep the Document List sidebar as a "sub-sidebar". */}
                <DocumentsPageContent collabId={collabId} isEmbedded={true} />
              </motion.div>
            )}

            {activeView === "tasks" && (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full h-full overflow-y-auto"
              >
                <TasksPageContent collabId={collabId} isEmbedded={true} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* --- Right Rail: Chat --- */}
      {/* Persist Chat in DOM to prevent reload/disconnect on toggle */}
      <motion.aside
        initial={false}
        animate={{
          width: isChatOpen ? 400 : 0,
          opacity: isChatOpen ? 1 : 0,
        }}
        className="h-full border-l border-white/5 bg-background/50 backdrop-blur-xl z-40 shadow-2xl overflow-hidden relative"
        style={{ pointerEvents: isChatOpen ? "auto" : "none" }} // Disable clicks when hidden
      >
        <div className="h-full w-[400px] relative">
          {" "}
          {/* Fixed width container */}
          {/* Close button removed here as Chat.js has one, or we can keep it external. 
                User complained about "double close button". Chat.js has one internal (line 280).
                UnifiedWorkspace had one external (line 250). 
                I will remove the external one here. 
            */}
          <Chat collabId={collabId} onClose={() => setIsChatOpen(false)} />
        </div>
      </motion.aside>

      {/* --- Floating Video Widget --- */}
      <AnimatePresence>
        {isVideoOpen && (
          <VideoCall roomId={collabId} onLeave={() => setIsVideoOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper Nav Button
const NavButton = ({
  icon,
  label,
  isActive,
  isCollapsed,
  onClick,
  alertColor,
  variant = "default",
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group
        ${
          isActive
            ? "bg-primary text-primary-foreground shadow-lg shadow-indigo-500/20"
            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
        }
        ${isCollapsed ? "justify-center" : ""}
      `}
      title={label}
    >
      <div className="shrink-0 relative">
        {icon}
        {alertColor && (
          <span
            className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-background ${alertColor}`}
          />
        )}
      </div>

      {!isCollapsed && (
        <span className="font-medium truncate text-sm">{label}</span>
      )}

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-white/10">
          {label}
        </div>
      )}
    </button>
  );
};
