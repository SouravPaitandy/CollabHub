"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  FaPlus,
  FaTimes,
  FaEdit,
  FaTrash,
  FaClipboardList,
  FaFilter,
  FaSearch,
  FaSortAmountDown,
  FaListUl,
  FaSyncAlt,
  FaEye,
  FaCheckSquare,
  FaCog,
  FaCheck,
} from "react-icons/fa";
import {
  MdOutlineLowPriority,
  MdPriorityHigh,
  MdOutlineFlag,
} from "react-icons/md";
import { BiSortAlt2 } from "react-icons/bi";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

// Constants for status types to avoid typos
const STATUS = {
  TODO: "todo",
  INPROGRESS: "inprogress",
  REVIEW: "review",
  DONE: "done",
};

// Expanded column configuration with colors and icons
const COLUMNS_CONFIG = {
  [STATUS.TODO]: {
    title: "To Do",
    color: "lg:bg-blue-500/10 text-blue-400",
    borderColor: "border-blue-500/20",
    icon: <FaListUl />,
    glow: "shadow-[0_0_15px_rgba(59,130,246,0.1)]",
  },
  [STATUS.INPROGRESS]: {
    title: "In Progress",
    color: "lg:bg-amber-500/10 text-amber-400",
    borderColor: "border-amber-500/20",
    icon: <FaSyncAlt />,
    glow: "shadow-[0_0_15px_rgba(245,158,11,0.1)]",
  },
  [STATUS.REVIEW]: {
    title: "Review",
    color: "lg:bg-purple-500/10 text-purple-400",
    borderColor: "border-purple-500/20",
    icon: <FaEye />,
    glow: "shadow-[0_0_15px_rgba(168,85,247,0.1)]",
  },
  [STATUS.DONE]: {
    title: "Done",
    color: "lg:bg-emerald-500/10 text-emerald-400",
    borderColor: "border-emerald-500/20",
    icon: <FaCheckSquare />,
    glow: "shadow-[0_0_15px_rgba(16,185,129,0.1)]",
  },
};

// Priority badges for tasks
const PRIORITY_BADGES = {
  high: {
    label: "High",
    icon: <MdPriorityHigh />,
    class: "bg-red-500/10 text-red-500 border-red-500/20 backdrop-blur-sm",
  },
  medium: {
    label: "Medium",
    icon: <MdOutlineFlag />,
    class:
      "bg-amber-500/10 text-amber-500 border-amber-500/20 backdrop-blur-sm",
  },
  low: {
    label: "Low",
    icon: <MdOutlineLowPriority />,
    class:
      "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 backdrop-blur-sm",
  },
};

// Task modal component with enhanced design and functionality
const TaskModal = ({ isOpen, onClose, task, onSubmit, isEditing }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignee, setAssignee] = useState("");
  const [validationError, setValidationError] = useState("");
  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setDueDate(task.dueDate || "");
      setPriority(task.priority || "medium");
      setAssignee(task.assignee || "");
    } else {
      // Reset form for new task
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("medium");
      setAssignee("");
    }
    setValidationError("");
  }, [task, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs
    if (!title.trim()) {
      setValidationError("Title is required");
      return;
    }
    if (assignee && assignee.length > 20) {
      setValidationError("Assignee name is too long (max 20 characters)");
      return;
    }
    if (!assignee || assignee.length < 1) {
      setValidationError("Assignee should be provided.");
      return;
    }

    onSubmit({
      ...task,
      title,
      description,
      dueDate: dueDate || null,
      priority,
      assignee: assignee || null,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex justify-center items-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          ref={modalRef}
          className="bg-background/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md border border-white/10 ring-1 ring-white/5 overflow-hidden"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="flex justify-between items-center p-6 border-b border-white/5">
            <h3 className="text-xl font-bold font-hacker text-foreground tracking-tight">
              {isEditing ? "Edit Task" : "Create New Task"}
            </h3>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-white/10"
              aria-label="Close modal"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">
                Title *
              </label>
              <input
                type="text"
                placeholder="Task title"
                className={`w-full p-3 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all ${
                  validationError
                    ? "border-destructive ring-1 ring-destructive"
                    : ""
                }`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              {validationError && (
                <p className="mt-1 text-sm text-destructive">
                  {validationError}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">
                Description
              </label>
              <textarea
                placeholder="Task description (optional)"
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  Due Date
                </label>
                <input
                  type="date"
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all [color-scheme:dark]"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  Priority
                </label>
                <div className="relative">
                  <select
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-foreground appearance-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="low" className="bg-gray-900">
                      Low
                    </option>
                    <option value="medium" className="bg-gray-900">
                      Medium
                    </option>
                    <option value="high" className="bg-gray-900">
                      High
                    </option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">
                Assignee
              </label>
              <input
                type="text"
                placeholder="Assign to teammate (optional)"
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-foreground transition-colors font-medium border border-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all font-medium border border-primary/20"
              >
                {isEditing ? "Update Task" : "Create Task"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Enhanced Task Card component
const TaskCard = ({ task, onEdit, onDelete, provided, snapshot, isAdmin }) => {
  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : null;
  const daysLeft = task.dueDate
    ? Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24)) -
      1
    : null;
  const isOverdue = daysLeft !== null && daysLeft < 0;
  const isToday = daysLeft === 0;
  const isTomorrow = daysLeft === 1;

  const priorityInfo = task.priority
    ? PRIORITY_BADGES[task.priority]
    : PRIORITY_BADGES.medium;

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={provided.draggableProps.style}
      className={`p-4 mb-3 rounded-2xl backdrop-blur-md border group relative overflow-hidden cursor-grab active:cursor-grabbing select-none ${
        snapshot.isDragging
          ? "shadow-[0_8px_40px_rgba(124,58,237,0.5)] bg-primary/25 border-primary/50 ring-2 ring-primary/40 scale-[1.02] opacity-90 z-50"
          : "bg-white/5 dark:bg-black/40 border-white/10 hover:border-white/20 hover:bg-white/10 hover:shadow-xl transition-all duration-200"
      }`}
    >
      {/* Drag Handle Visual Indicator (decorative only) */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none">
        <div className="flex flex-col gap-0.5">
          <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
          <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
          <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
          <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
          <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
          <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
        </div>
      </div>

      <div className="flex justify-between items-start z-10 relative pl-2">
        <div className="flex-1">
          <h4 className="font-semibold text-foreground line-clamp-2 font-geist-sans tracking-tight leading-snug">
            {task.title}
          </h4>

          {task.description && (
            <p className="text-sm text-muted-foreground mt-2 break-words line-clamp-3 font-geist-sans">
              {task.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {/* Priority badge */}
            <span
              className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border flex items-center gap-1.5 ${priorityInfo.class}`}
            >
              {priorityInfo.icon} {priorityInfo.label}
            </span>

            {/* Due date badge */}
            {formattedDate && (
              <span
                className={`text-[10px] font-medium px-2 py-1 rounded-full border flex items-center gap-1.5
                ${
                  isOverdue
                    ? "bg-destructive/10 text-destructive border-destructive/20"
                    : isToday
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      : "bg-white/5 text-muted-foreground border-white/10"
                }`}
              >
                {isOverdue
                  ? `Overdue: ${Math.abs(daysLeft)}d`
                  : isToday
                    ? "Today"
                    : isTomorrow
                      ? "Tomorrow"
                      : formattedDate}
              </span>
            )}
            {/* Assignee badge */}
            {task.assignee && (
              <p
                className="text-sm font-geist-sans px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium truncate"
                title={task.assignee}
              >
                @{task.assignee}
              </p>
            )}
          </div>
        </div>

        {isAdmin && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="text-muted-foreground hover:text-primary transition-colors p-1.5 hover:bg-white/10 rounded-full"
              aria-label="Edit task"
              title="Edit task"
            >
              <FaEdit size={12} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task._id);
              }}
              className="text-muted-foreground hover:text-destructive transition-colors p-1.5 hover:bg-white/10 rounded-full"
              aria-label="Delete task"
              title="Delete task"
            >
              <FaTrash size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Column component
const TaskColumn = ({
  columnId,
  column,
  tasks,
  onEdit,
  onDelete,
  isSearching,
  isAdmin,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-transparent overflow-visible flex flex-col w-full min-w-[300px]"
    key={columnId}
  >
    <div
      className={`rounded-2xl p-1 mb-3 backdrop-blur-3xl bg-black/20 border ${COLUMNS_CONFIG[columnId].borderColor} shadow-lg relative overflow-hidden group/col`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover/col:opacity-100 transition-opacity" />
      <h3
        className={`font-medium py-3 px-4 flex justify-between items-center relative z-10`}
      >
        <span className="flex items-center gap-2">
          <span
            className={`opacity-100 text-base md:text-lg drop-shadow-md ${COLUMNS_CONFIG[columnId].color.split(" ")[1] || "text-foreground"}`}
          >
            {COLUMNS_CONFIG[columnId].icon}
          </span>
          <span
            className={`font-bold tracking-wide font-hacker text-sm md:text-base ${COLUMNS_CONFIG[columnId].color.split(" ")[1] || "text-foreground"}`}
          >
            {COLUMNS_CONFIG[columnId].title}
          </span>
        </span>
        <span className="bg-white/10 text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full shadow-inner ring-1 ring-white/10 text-muted-foreground">
          {tasks.length}
        </span>
      </h3>
    </div>

    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`flex-grow p-2 rounded-3xl min-h-[400px] max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar transition-all duration-200 ${
            snapshot.isDraggingOver
              ? "bg-primary/5 ring-2 ring-primary/20 ring-inset"
              : "bg-transparent"
          }`}
        >
          <AnimatePresence>
            {tasks.map((task, index) => (
              <Draggable
                key={task._id}
                draggableId={task._id.toString()}
                index={index}
              >
                {(provided, snapshot) => (
                  <TaskCard
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    provided={provided}
                    snapshot={snapshot}
                    isAdmin={isAdmin}
                  />
                )}
              </Draggable>
            ))}
          </AnimatePresence>
          {provided.placeholder}

          {tasks.length === 0 && !isSearching && (
            <div className="h-full select-none flex flex-col items-center justify-center text-center p-6">
              <div className="text-gray-500 dark:text-gray-400 w-16 h-16 mb-4 flex items-center justify-center">
                {columnId === STATUS.TODO ? (
                  <FaClipboardList />
                ) : columnId === STATUS.INPROGRESS ? (
                  <FaCog />
                ) : columnId === STATUS.REVIEW ? (
                  <FaSearch />
                ) : (
                  <FaCheck />
                )}
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                {columnId === STATUS.TODO
                  ? "No tasks to do yet"
                  : "Drag tasks here"}
              </p>
              {columnId === STATUS.TODO && (
                <p className="text-gray-400 dark:text-gray-500 text-xs italic">
                  Click &apos;Add Task&apos; to get started
                </p>
              )}
            </div>
          )}

          {tasks.length === 0 && isSearching && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No matching tasks in this column
              </p>
            </div>
          )}
        </div>
      )}
    </Droppable>
  </motion.div>
);

// Enhanced Loading spinner
const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center h-64 space-y-6">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="p-4 rounded-full bg-primary/20 backdrop-blur-md shadow-[0_0_30px_rgba(124,58,237,0.3)]"
    >
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
    </motion.div>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="text-muted-foreground font-medium font-hacker animate-pulse"
    >
      Loading your tasks...
    </motion.p>
  </div>
);

// Enhanced Error component
const ErrorDisplay = ({ message, onRetry }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-xl shadow-sm border border-red-200 dark:border-red-800 max-w-lg mx-auto"
  >
    <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-800/50 text-red-500 dark:text-red-300">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <h3 className="font-bold text-xl mb-3 text-red-600 dark:text-red-400">
      Error loading tasks
    </h3>
    <p className="mb-5 text-red-500 dark:text-red-300">{message}</p>
    <button
      onClick={onRetry}
      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm hover:shadow transition-colors inline-flex items-center justify-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      Try Again
    </button>
  </motion.div>
);

// Enhanced Confirmation dialog
const ConfirmationDialog = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex justify-center items-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-background/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 max-w-sm w-full border border-white/10 ring-1 ring-white/5"
        >
          <div className="text-center mb-4">
            <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center rounded-full bg-destructive/10 text-destructive border border-destructive/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 font-hacker text-foreground">
              Delete Confirmation
            </h3>
          </div>
          <p className="text-muted-foreground mb-6 text-center">{message}</p>
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-foreground transition-colors font-medium border border-white/10"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onConfirm}
              className="px-5 py-2.5 rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg shadow-destructive/20 transition-all font-medium"
            >
              Delete
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Empty state component
const EmptyTaskBoard = ({ onAddTask }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white/5 backdrop-blur-lg rounded-3xl shadow-2xl p-12 text-center border border-white/10 ring-1 ring-white/5 max-w-2xl mx-auto"
  >
    <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 shadow-[0_0_30px_rgba(124,58,237,0.2)]">
      <FaClipboardList className="w-10 h-10" />
    </div>
    <h3 className="text-3xl font-bold mb-4 font-hacker bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
      No tasks yet
    </h3>
    <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg font-geist-sans">
      Get started by creating your first task. Tasks help you organize your work
      and track progress efficiently.
    </p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={(e) => {
        e.preventDefault();
        onAddTask();
      }}
      className="px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all font-bold text-lg inline-flex items-center gap-2"
    >
      <FaPlus /> Create Your First Task
    </motion.button>
  </motion.div>
);

// Main Kanban Board component with enhanced features
const TaskBoard = ({ collabId, isAdmin }) => {
  // Task data state
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortOrder, setSortOrder] = useState("dueDate"); // options: 'dueDate', 'priority', 'title'

  const { session } = useSession();

  // Filter tasks based on search and filters
  const getFilteredTasks = useCallback(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        searchTerm === "" ||
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description &&
          task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.assignee &&
          task.assignee.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesPriority =
        filterPriority === "all" || task.priority === filterPriority;

      return matchesSearch && matchesPriority;
    });
  }, [tasks, searchTerm, filterPriority]);

  // Sort tasks based on sort order
  const getSortedTasks = useCallback(
    (taskList) => {
      return [...taskList].sort((a, b) => {
        if (sortOrder === "dueDate") {
          // Sort by due date (null dates at the end)
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (sortOrder === "priority") {
          // Sort by priority (high > medium > low)
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return (
            priorityOrder[a.priority || "medium"] -
            priorityOrder[b.priority || "medium"]
          );
        } else if (sortOrder === "title") {
          // Sort alphabetically
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
    },
    [sortOrder],
  );

  // Function to organize tasks into columns
  const getColumnTasks = useCallback(() => {
    const filteredTasks = getFilteredTasks();
    const sortedTasks = getSortedTasks(filteredTasks);

    const columnTasks = {};

    Object.keys(COLUMNS_CONFIG).forEach((columnId) => {
      columnTasks[columnId] = sortedTasks.filter(
        (task) => (task.status || STATUS.TODO) === columnId,
      );
    });

    return columnTasks;
  }, [getFilteredTasks, getSortedTasks]);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    if (!collabId) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/collab/${collabId}/tasks`);

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();

      // Ensure each task has a valid status
      const processedTasks = Array.isArray(data)
        ? data.map((task) => ({
            ...task,
            status:
              task.status?.toLowerCase().replace(/\s+/g, "") || STATUS.TODO,
            priority: task.priority || "medium",
          }))
        : [];

      setTasks(processedTasks);
      setError(null);
      toast.success("Tasks loaded successfully", { duration: 3000 });
    } catch (err) {
      setError(err.message);
      console.error("Error fetching tasks:", err);
      toast.error("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, [collabId]);

  // Load tasks on component mount
  useEffect(() => {
    if (collabId) {
      fetchTasks();
    }
  }, [collabId, fetchTasks]);

  // Modal handlers
  const openAddTaskModal = () => {
    console.log("Opening add task modal");
    setCurrentTask(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditTaskModal = (task) => {
    setCurrentTask(task);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTask(null);
    setIsEditing(false);
  };

  // Task CRUD operations
  const handleCreateTask = async (taskData) => {
    try {
      console.log("Creating task:", taskData);

      const response = await fetch(`/api/collab/${collabId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description,
          status: STATUS.TODO,
          dueDate: taskData.dueDate,
          priority: taskData.priority || "medium",
          assignee: taskData.assignee,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const createdTask = await response.json();

      // Optimistic update
      setTasks((prev) => [...prev, createdTask]);
      toast.success("Task created successfully");
    } catch (err) {
      console.error("Error creating task:", err);
      toast.error("Failed to create task");
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      // Save original tasks for rollback
      const originalTasks = [...tasks];

      // Optimistic update
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskData._id ? { ...task, ...taskData } : task,
        ),
      );

      const response = await fetch(
        `/api/collab/${collabId}/tasks/${taskData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: taskData.title,
            description: taskData.description,
            status: taskData.status,
            dueDate: taskData.dueDate,
            priority: taskData.priority || "medium",
            assignee: taskData.assignee,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      toast.success("Task updated successfully");
    } catch (err) {
      // Rollback on error
      setTasks(originalTasks);
      console.error("Error updating task:", err);
      toast.error("Failed to update task");
    }
  };

  const confirmDeleteTask = (taskId) => {
    setTaskToDelete(taskId);
    setShowConfirmation(true);
  };

  const cancelDeleteTask = () => {
    setTaskToDelete(null);
    setShowConfirmation(false);
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      // Save original tasks for rollback
      const originalTasks = [...tasks];

      // Optimistic update
      setTasks((prev) => prev.filter((task) => task._id !== taskToDelete));

      const response = await fetch(
        `/api/collab/${collabId}/tasks/${taskToDelete}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      toast.success("Task deleted successfully");
    } catch (err) {
      // Rollback on error
      setTasks(originalTasks);
      console.error("Error deleting task:", err);
      toast.error("Failed to delete task");
    } finally {
      cancelDeleteTask();
    }
  };

  // Drag and drop handler
  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // Skip if dropped outside or same position
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    // Find the task
    const taskToMove = tasks.find(
      (task) => task._id.toString() === draggableId,
    );
    if (!taskToMove) return;

    // Create a copy for optimistic update
    const newTasks = [...tasks];
    const updatedTask = { ...taskToMove, status: destination.droppableId };

    // Update the task in the array
    const taskIndex = newTasks.findIndex((task) => task._id === taskToMove._id);
    if (taskIndex !== -1) {
      newTasks[taskIndex] = updatedTask;
    }

    // Save original tasks for rollback
    const originalTasks = [...tasks];

    // Apply optimistic update
    setTasks(newTasks);

    // Show toast with the new status
    const statusName = COLUMNS_CONFIG[destination.droppableId].title;
    toast.success(`Task moved to "${statusName}"`);

    // Send update to server
    try {
      const response = await fetch(
        `/api/collab/${collabId}/tasks/${taskToMove._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...taskToMove,
            status: destination.droppableId,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update task status");
      }
    } catch (err) {
      // Rollback on error
      setTasks(originalTasks);
      console.error("Error updating task status:", err);
      toast.error("Failed to update task status");
    }
  };

  // Handle task submission from modal
  const handleTaskSubmit = (taskData) => {
    if (isEditing && currentTask) {
      handleUpdateTask(taskData);
    } else {
      handleCreateTask(taskData);
    }
  };

  // Clear all filters and search
  const clearFilters = () => {
    setSearchTerm("");
    setFilterPriority("all");
    setSortOrder("dueDate");
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={fetchTasks} />;
  }

  // Get tasks organized by column
  const columnTasks = getColumnTasks();
  const filteredTasks = getFilteredTasks();
  const isFiltering = searchTerm !== "" || filterPriority !== "all";
  const totalTasks = tasks.length;

  // Show empty state if no tasks
  if (totalTasks === 0) {
    return (
      <>
        <EmptyTaskBoard onAddTask={openAddTaskModal} />
        {/* Task Modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={closeModal}
          task={currentTask}
          onSubmit={handleTaskSubmit}
          isEditing={isEditing}
        />
        <ConfirmationDialog
          isOpen={showConfirmation}
          message="Are you sure you want to delete this task? This action cannot be undone."
          onConfirm={handleDeleteTask}
          onCancel={cancelDeleteTask}
        />
      </>
    );
  }

  return (
    <div className="bg-transparent rounded-2xl relative">
      {/* Refresh Button - repositioned for better mobile experience */}
      <motion.button
        whileHover={{ scale: 1.05, rotate: 180 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.4 }}
        onClick={fetchTasks}
        className="absolute top-0 right-0 z-10 p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-primary border border-white/10 backdrop-blur-md shadow-lg transition-all"
        title="Refresh tasks"
        aria-label="Refresh tasks"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
            clipRule="evenodd"
          />
        </svg>
      </motion.button>

      {/* Header section with improved mobile layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 mt-1 sm:mt-0 pr-12 sm:pr-0">
        <div className="flex items-center">
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 mr-4 backdrop-blur-sm shadow-[0_0_15px_rgba(124,58,237,0.15)]">
            <FaClipboardList className="text-primary text-base sm:text-xl" />
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-bold font-hacker text-foreground tracking-tight">
              Task Board
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm font-geist-sans font-medium">
              <span className="text-primary font-bold">{totalTasks}</span>{" "}
              {totalTasks === 1 ? "task" : "tasks"} in total
            </p>
          </div>
          {isAdmin && (
            <div className="ml-4">
              <span className="bg-primary/10 text-primary px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border border-primary/20 backdrop-blur-sm">
                Admin Access
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Controls toolbar - stacked on mobile, side by side on larger screens */}
      <div className="flex flex-col w-full gap-4 mb-8">
        <div className="relative w-full group">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-10 py-2 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-geist-sans backdrop-blur-xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground p-2"
            >
              <FaTimes size={12} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5 relative group">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="appearance-none w-full pl-4 pr-10 py-2 bg-white/5 border border-white/10 rounded-xl text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-geist-sans backdrop-blur-sm"
            >
              <option value="all" className="bg-gray-900">
                All Priorities
              </option>
              <option value="high" className="bg-gray-900">
                High Priority
              </option>
              <option value="medium" className="bg-gray-900">
                Medium Priority
              </option>
              <option value="low" className="bg-gray-900">
                Low Priority
              </option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-muted-foreground group-hover:text-primary transition-colors">
              <FaFilter size={14} />
            </div>
          </div>

          <div className="md:col-span-4 relative group">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="appearance-none w-full pl-4 pr-10 py-2 bg-white/5 border border-white/10 rounded-xl text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-geist-sans backdrop-blur-sm"
            >
              <option value="dueDate" className="bg-gray-900">
                Sort by Due Date
              </option>
              <option value="priority" className="bg-gray-900">
                Sort by Priority
              </option>
              <option value="title" className="bg-gray-900">
                Sort by Title
              </option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-muted-foreground group-hover:text-primary transition-colors">
              <BiSortAlt2 size={16} />
            </div>
          </div>

          <div className="md:col-span-3">
            {isAdmin && (
              <button
                onClick={openAddTaskModal}
                className="w-full py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center whitespace-nowrap font-bold font-hacker tracking-wide"
              >
                <FaPlus className="mr-2" /> Add Task
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter status bar - responsive layout */}
      {isFiltering && (
        <div className="mb-6 py-3 px-4 bg-primary/10 rounded-xl border border-primary/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 backdrop-blur-sm">
          <div className="text-sm text-primary font-medium font-geist-sans">
            <span className="font-bold">Filtered View: </span>
            {filteredTasks.length}{" "}
            {filteredTasks.length === 1 ? "task" : "tasks"} found
            {searchTerm && (
              <span className="ml-1 sm:ml-2">
                matches &quot;{searchTerm}&quot;
              </span>
            )}
            {filterPriority !== "all" && (
              <span className="ml-1 sm:ml-2 capitalize">
                • {filterPriority} priority
              </span>
            )}
          </div>
          <button
            onClick={clearFilters}
            className="text-xs px-3 py-1.5 bg-white/10 rounded-lg border border-white/10 text-foreground hover:bg-white/20 transition-colors font-medium w-full sm:w-auto"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Kanban Board with improved mobile layout */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 overflow-auto">
          {Object.keys(COLUMNS_CONFIG).map((columnId) => (
            <TaskColumn
              key={columnId}
              columnId={columnId}
              column={COLUMNS_CONFIG[columnId]}
              tasks={columnTasks[columnId]}
              onEdit={openEditTaskModal}
              onDelete={confirmDeleteTask}
              isSearching={isFiltering}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      </DragDropContext>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        task={currentTask}
        onSubmit={handleTaskSubmit}
        isEditing={isEditing}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmation}
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleDeleteTask}
        onCancel={cancelDeleteTask}
      />
    </div>
  );
};

export default TaskBoard;
