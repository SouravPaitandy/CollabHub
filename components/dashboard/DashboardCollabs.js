import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FiSettings,
  FiMessageSquare,
  FiClipboard,
  FiExternalLink,
  FiUser,
  FiUsers,
  FiLayers,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiActivity,
} from "react-icons/fi";
import SpotlightCard from "../ui/SpotlightCard";

const DashboardCollabs = ({ adminCollabs, memberCollabs, username }) => {
  const [activeTab, setActiveTab] = useState("admin"); // 'admin' or 'member'
  const [adminPage, setAdminPage] = useState(0);
  const [memberPage, setMemberPage] = useState(0);
  const itemsPerPage = 6; // Increased density for modern feel

  // Pagination Logic
  const paginate = (items, page) => {
    return items.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  };

  const currentAdminCollabs = paginate(adminCollabs, adminPage);
  const currentMemberCollabs = paginate(memberCollabs, memberPage);

  const adminMaxPage = Math.ceil(adminCollabs.length / itemsPerPage) - 1;
  const memberMaxPage = Math.ceil(memberCollabs.length / itemsPerPage) - 1;

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 120 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3 aura-text-glow">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your projects and collaborations in one place.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-8">
        <div className="flex space-x-8">
          <TabButton
            isActive={activeTab === "admin"}
            onClick={() => setActiveTab("admin")}
            icon={<FiLayers className="w-4 h-4" />}
            label="My Projects"
            count={adminCollabs.length}
          />
          <TabButton
            isActive={activeTab === "member"}
            onClick={() => setActiveTab("member")}
            icon={<FiUsers className="w-4 h-4" />}
            label="Joined Projects"
            count={memberCollabs.length}
          />
        </div>
      </div>

      {/* Grid Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "admin" && (
            <ProjectGrid
              collabs={currentAdminCollabs}
              page={adminPage}
              maxPage={adminMaxPage}
              setPage={setAdminPage}
              isEmpty={adminCollabs.length === 0}
              emptyMessage="You haven't created any projects yet."
              variants={containerVariants}
              itemVariants={itemVariants}
              username={username}
              isAdmin={true}
            />
          )}

          {activeTab === "member" && (
            <ProjectGrid
              collabs={currentMemberCollabs}
              page={memberPage}
              maxPage={memberMaxPage}
              setPage={setMemberPage}
              isEmpty={memberCollabs.length === 0}
              emptyMessage="You haven't joined any projects yet."
              variants={containerVariants}
              itemVariants={itemVariants}
              username={username}
              isAdmin={false}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

// --- Sub Components ---

const TabButton = ({ isActive, onClick, icon, label, count }) => (
  <button
    onClick={onClick}
    className={`pb-4 text-sm font-medium flex items-center gap-2 transition-colors duration-300 relative ${
      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
    }`}
  >
    {icon}
    {label}
    <span
      className={`ml-1 text-xs px-2 py-0.5 rounded-full transition-colors duration-300 ${
        isActive ? "bg-white/10 text-primary" : "bg-muted text-muted-foreground"
      }`}
    >
      {count}
    </span>
    {isActive && (
      <motion.div
        layoutId="activeTab"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-t-full"
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    )}
  </button>
);

const ProjectGrid = ({
  collabs,
  page,
  maxPage,
  setPage,
  isEmpty,
  emptyMessage,
  variants,
  itemVariants,
  username,
  isAdmin,
}) => {
  if (isEmpty)
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-xl bg-muted/30">
        <FiLayers className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
        <p className="text-muted-foreground font-medium">{emptyMessage}</p>
      </div>
    );

  return (
    <>
      <motion.div
        variants={variants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {collabs.map((collab) => (
          <motion.div
            key={collab.collabId}
            variants={itemVariants}
            className="h-full"
          >
            <SpotlightCard className="h-full flex flex-col overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
              {/* Card Header image pattern (abstract) */}
              <div className="h-24 w-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 group-hover:from-indigo-50 group-hover:to-purple-50 dark:group-hover:from-indigo-950/30 dark:group-hover:to-purple-950/30 transition-colors duration-300 relative z-10" />

              <div className="p-5 flex-1 flex flex-col relative z-20">
                {/* Icon Badge */}
                <div className="absolute -top-6 left-5">
                  <div className="w-12 h-12 rounded-lg bg-background border border-border flex items-center justify-center shadow-lg text-primary z-30">
                    {isAdmin ? (
                      <FiLayers className="w-6 h-6" />
                    ) : (
                      <FiUsers className="w-6 h-6" />
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {collab.collabName}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <FiUser className="w-3 h-3" />{" "}
                      {isAdmin ? "Admin" : "Member"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FiUsers className="w-3 h-3" /> Team
                    </span>
                  </div>

                  {/* Actions Grid */}
                  <div className="grid grid-cols-1 gap-2 mt-auto pt-4 border-t border-border/50">
                    <ActionButton
                      href={`/collab/${collab.collabId}`}
                      icon={<FiActivity />}
                      label="Go to Workspace"
                      title="Go to Workspace"
                    />
                    {/* <ActionButton
                      href={`/collab/${collab.collabId}?view=tasks`}
                      icon={<FiClipboard />}
                      label="Tasks"
                    />
                    <ActionButton
                      href={`/collab/${collab.collabId}?view=docs`}
                      icon={<FiFileText />}
                      label="Docs"
                    /> */}

                    {isAdmin && (
                      <Link
                        href={`/collab/admin/${collab.collabId}`}
                        className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors z-30"
                      >
                        <FiSettings className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      {(page > 0 || maxPage > 0) && (
        <div className="flex justify-end mt-8 gap-2">
          <button
            onClick={() => page > 0 && setPage(page - 1)}
            disabled={page === 0}
            className="p-2 rounded-lg border border-border text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiChevronLeft />
          </button>
          <span className="flex items-center px-2 text-sm text-muted-foreground">
            Page {page + 1} of {maxPage + 1}
          </span>
          <button
            onClick={() => page < maxPage && setPage(page + 1)}
            disabled={page >= maxPage}
            className="p-2 rounded-lg border border-border text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiChevronRight />
          </button>
        </div>
      )}
    </>
  );
};

const ActionButton = ({ href, icon, label }) => (
  <Link
    href={href}
    className="flex flex-col md:flex-row items-center justify-center md:gap-2 p-2 rounded-lg hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all gap-1 group relative z-30"
  >
    <span className="text-lg group-hover:scale-110 transition-transform duration-200">
      {icon}
    </span>
    <span className="text-[10px] font-medium uppercase tracking-wider">
      {label}
    </span>
  </Link>
);

export default DashboardCollabs;
