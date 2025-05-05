"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FaPlus, FaTimes, FaEdit, FaTrash, FaClipboardList, FaFilter, FaSearch, FaSortAmountDown } from 'react-icons/fa';
import { MdOutlineLowPriority, MdPriorityHigh, MdOutlineFlag } from 'react-icons/md';
import { BiSortAlt2 } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';

// Constants for status types to avoid typos
const STATUS = {
  TODO: 'todo',
  INPROGRESS: 'inprogress',
  REVIEW: 'review',
  DONE: 'done'
};

// Expanded column configuration with colors and icons
const COLUMNS_CONFIG = {
  [STATUS.TODO]: { 
    title: 'To Do',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
    borderColor: 'border-blue-200 dark:border-blue-800',
    icon: '📋'
  },
  [STATUS.INPROGRESS]: { 
    title: 'In Progress',
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200',
    borderColor: 'border-amber-200 dark:border-amber-800',
    icon: '⚙️'
  },
  [STATUS.REVIEW]: { 
    title: 'Review',
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200',
    borderColor: 'border-purple-200 dark:border-purple-800',
    icon: '🔍'
  },
  [STATUS.DONE]: { 
    title: 'Done',
    color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
    borderColor: 'border-green-200 dark:border-green-800',
    icon: '✅'
  }
};

// Priority badges for tasks
const PRIORITY_BADGES = {
  high: { 
    label: 'High',
    icon: <MdPriorityHigh />,
    class: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800'
  },
  medium: { 
    label: 'Medium',
    icon: <MdOutlineFlag />,
    class: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
  },
  low: { 
    label: 'Low',
    icon: <MdOutlineLowPriority />,
    class: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800'
  }
};

// Task modal component with enhanced design and functionality
const TaskModal = ({ isOpen, onClose, task, onSubmit, isEditing }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [assignee, setAssignee] = useState('');
  const [validationError, setValidationError] = useState('');
  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setDueDate(task.dueDate || '');
      setPriority(task.priority || 'medium');
      setAssignee(task.assignee || '');
    } else {
      // Reset form for new task
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setAssignee('');
    }
    setValidationError('');
  }, [task, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!title.trim()) {
      setValidationError('Title is required');
      return;
    }
    if(assignee && assignee.length > 20) {
      setValidationError('Assignee name is too long (max 20 characters)');
      return;
    }
    if(!assignee || assignee.length < 1){
      setValidationError('Assignee should be provided.');
      return;
    }
    
    onSubmit({
      ...task,
      title,
      description,
      dueDate: dueDate || null,
      priority,
      assignee: assignee || null
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div 
          ref={modalRef}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-t-xl">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Close modal"
            >
              <FaTimes />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Title *</label>
              <input
                type="text"
                placeholder="Task title"
                className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                  validationError ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
                }`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              {validationError && (
                <p className="mt-1 text-sm text-red-500">{validationError}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                placeholder="Task description (optional)"
                className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Due Date</label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Priority</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Assignee</label>
              <input
                type="text"
                placeholder="Assign to teammate (optional)"
                className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-sm hover:shadow transition-all font-medium"
              >
                {isEditing ? 'Update Task' : 'Create Task'}
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
  const formattedDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : null;
  const daysLeft = task.dueDate ? Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24)) -1 : null;
  const isOverdue = daysLeft !== null && daysLeft < 0;
  const isToday = daysLeft === 0;
  const isTomorrow = daysLeft === 1;
  
  const priorityInfo = task.priority ? PRIORITY_BADGES[task.priority] : PRIORITY_BADGES.medium;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`p-4 mb-3 rounded-lg ${
        snapshot.isDragging 
          ? 'shadow-lg bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-300 dark:border-indigo-700' 
          : 'shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
      } hover:shadow-md transition-all duration-200 group`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-medium text-gray-800 dark:text-gray-200 line-clamp-2">{task.title}</h4>
          
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 break-words line-clamp-3">
              {task.description}
            </p>
          )}
          
          <div className="mt-3 flex flex-wrap gap-2">
            {/* Priority badge */}
            <span className={`text-xs px-2 py-1 rounded-full border flex items-center gap-1 ${priorityInfo.class}`}>
              {priorityInfo.icon} {priorityInfo.label}
            </span>
            
            {/* Due date badge */}
            {formattedDate && (
              <span className={`text-xs px-2 py-1 rounded-full border flex items-center gap-1
                ${isOverdue 
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800' 
                  : isToday
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                }`}
              >
                {isOverdue 
                  ? `Overdue: ${Math.abs(daysLeft)} days`
                  : isToday
                    ? 'Due today'
                    : isTomorrow
                      ? 'Due tomorrow'
                      : `Due: ${formattedDate}`}
              </span>
            )}
            {/* Assignee badge */}
            {task.assignee && (
              <p className="text-xs px-4 py-1 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Assigned to: <span className='font-bold'>{task.assignee}</span>
              </p>
            )}
          </div>
        </div>
        
        {isAdmin && <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 ml-2">
          <button 
            onClick={() => onEdit(task)}
            className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            aria-label="Edit task"
            title="Edit task"
          >
            <FaEdit size={14} />
          </button>
          <button 
            onClick={() => onDelete(task._id)}
            className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            aria-label="Delete task"
            title="Delete task"
          >
            <FaTrash size={14} />
          </button>
        </div>}
      </div>
    </motion.div>
  );
};

// Enhanced Column component
const TaskColumn = ({ columnId, column, tasks, onEdit, onDelete, isSearching, isAdmin }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-sm overflow-hidden flex flex-col w-full"
    key={columnId}
  >
    <h3 className={`font-medium py-3 px-4 ${COLUMNS_CONFIG[columnId].color} flex justify-between items-center sticky top-0 z-10 border-b ${COLUMNS_CONFIG[columnId].borderColor}`}>
      <span className="flex items-center">
        <span className="mr-2">{COLUMNS_CONFIG[columnId].icon}</span>
        {COLUMNS_CONFIG[columnId].title}
      </span>
      <span className="bg-white/90 dark:bg-gray-800/90 text-xs font-bold px-2.5 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
        {tasks.length}
      </span>
    </h3>
    
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`flex-grow p-3 transition-colors duration-200 overflow-y-auto min-h-[350px] max-h-[calc(100vh-300px)] ${
            snapshot.isDraggingOver 
              ? `bg-blue-50/70 dark:bg-blue-900/30 border border-dashed ${COLUMNS_CONFIG[columnId].borderColor}` 
              : 'bg-transparent'
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
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                {columnId === STATUS.TODO 
                  ? '📋' 
                  : columnId === STATUS.INPROGRESS
                    ? '⚙️'
                    : columnId === STATUS.REVIEW
                      ? '🔍'
                      : '✅'}
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                {columnId === STATUS.TODO 
                  ? 'No tasks to do yet' 
                  : 'Drag tasks here'}
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
        repeatType: "reverse"
      }}
      className="p-4 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600"
    >
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent"></div>
    </motion.div>
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="text-gray-600 dark:text-gray-400 font-medium"
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
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    </div>
    <h3 className="font-bold text-xl mb-3 text-red-600 dark:text-red-400">Error loading tasks</h3>
    <p className="mb-5 text-red-500 dark:text-red-300">{message}</p>
    <button 
      onClick={onRetry}
      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm hover:shadow transition-colors inline-flex items-center justify-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-sm w-full border border-gray-200 dark:border-gray-700"
        >
          <div className="text-center mb-4">
            <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Delete Confirmation</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">{message}</p>
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="px-5 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onConfirm}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-sm hover:shadow transition-all font-medium"
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
    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700"
  >
    <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-300">
      <FaClipboardList className="w-12 h-12" />
    </div>
    <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-200">
      No tasks yet
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
      Get started by creating your first task for this collaboration. Tasks help you organize your work and track progress.
    </p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={(e) => {
        e.preventDefault();
        onAddTask();
        console.log('Add Task button clicked');
        
      }}
      className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all font-medium inline-flex items-center"
    >
      <FaPlus className="mr-2" /> Create Your First Task
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortOrder, setSortOrder] = useState('dueDate'); // options: 'dueDate', 'priority', 'title'

  const { session } = useSession();
  
  // Filter tasks based on search and filters
  const getFilteredTasks = useCallback(() => {
    return tasks.filter(task => {
      const matchesSearch = searchTerm === '' || 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.assignee && task.assignee.toLowerCase().includes(searchTerm.toLowerCase()));
        
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      
      return matchesSearch && matchesPriority;
    });
  }, [tasks, searchTerm, filterPriority]);
  
  // Sort tasks based on sort order
  const getSortedTasks = useCallback((taskList) => {
    return [...taskList].sort((a, b) => {
      if (sortOrder === 'dueDate') {
        // Sort by due date (null dates at the end)
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      } 
      else if (sortOrder === 'priority') {
        // Sort by priority (high > medium > low)
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority || 'medium'] - priorityOrder[b.priority || 'medium'];
      }
      else if (sortOrder === 'title') {
        // Sort alphabetically
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [sortOrder]);
  
  // Function to organize tasks into columns
  const getColumnTasks = useCallback(() => {
    const filteredTasks = getFilteredTasks();
    const sortedTasks = getSortedTasks(filteredTasks);
    
    const columnTasks = {};
    
    Object.keys(COLUMNS_CONFIG).forEach(columnId => {
      columnTasks[columnId] = sortedTasks.filter(task => 
        (task.status || STATUS.TODO) === columnId
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
      const processedTasks = Array.isArray(data) ? data.map(task => ({
        ...task,
        status: task.status?.toLowerCase().replace(/\s+/g, '') || STATUS.TODO,
        priority: task.priority || 'medium'
      })) : [];
      
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
    console.log('Opening add task modal');
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
      console.log('Creating task:', taskData);
      
      const response = await fetch(`/api/collab/${collabId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description,
          status: STATUS.TODO,
          dueDate: taskData.dueDate,
          priority: taskData.priority || 'medium',
          assignee: taskData.assignee
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      
      const createdTask = await response.json();
      
      // Optimistic update
      setTasks(prev => [...prev, createdTask]);
      toast.success("Task created successfully");
    } catch (err) {
      console.error('Error creating task:', err);
      toast.error("Failed to create task");
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      // Save original tasks for rollback
      const originalTasks = [...tasks];
      
      // Optimistic update
      setTasks(prev => prev.map(task => 
        task._id === taskData._id ? { ...task, ...taskData } : task
      ));
      
      const response = await fetch(`/api/collab/${collabId}/tasks/${taskData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          dueDate: taskData.dueDate,
          priority: taskData.priority || 'medium',
          assignee: taskData.assignee
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      
      toast.success("Task updated successfully");
    } catch (err) {
      // Rollback on error
      setTasks(originalTasks);
      console.error('Error updating task:', err);
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
      setTasks(prev => prev.filter(task => task._id !== taskToDelete));
      
      const response = await fetch(`/api/collab/${collabId}/tasks/${taskToDelete}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      
      toast.success("Task deleted successfully");
    } catch (err) {
      // Rollback on error
      setTasks(originalTasks);
      console.error('Error deleting task:', err);
      toast.error("Failed to delete task");
    } finally {
      cancelDeleteTask();
    }
  };

  // Drag and drop handler
  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    
    // Skip if dropped outside or same position
    if (!destination || 
        (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }
    
    // Find the task
    const taskToMove = tasks.find(task => task._id.toString() === draggableId);
    if (!taskToMove) return;
    
    // Create a copy for optimistic update
    const newTasks = [...tasks];
    const updatedTask = { ...taskToMove, status: destination.droppableId };
    
    // Update the task in the array
    const taskIndex = newTasks.findIndex(task => task._id === taskToMove._id);
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
      const response = await fetch(`/api/collab/${collabId}/tasks/${taskToMove._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...taskToMove,
          status: destination.droppableId
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task status');
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
    setSearchTerm('');
    setFilterPriority('all');
    setSortOrder('dueDate');
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
  const isFiltering = searchTerm !== '' || filterPriority !== 'all';
  const totalTasks = tasks.length;

  // Show empty state if no tasks
  if (totalTasks === 0) {
    return(
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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-3 sm:p-6 relative">
      {/* Refresh Button - repositioned for better mobile experience */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={fetchTasks}
        className="absolute top-3 sm:top-7 right-3 sm:right-5 lg:right-7 z-10 p-2 sm:p-2.5 rounded-full bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/50 text-indigo-600 dark:text-indigo-300 transition-colors shadow-sm"
        title="Refresh tasks"
        aria-label="Refresh tasks"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
      </motion.button>
      
      {/* Header section with improved mobile layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 mt-2 sm:mt-0 pr-12 sm:pr-0">
        <div className="flex items-center">
          <FaClipboardList className="text-indigo-500 mr-2 sm:mr-3 text-xl sm:text-2xl" />
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Task Board
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
              {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'} in total
            </p>
          </div>
        </div>
      </div>
        
      {/* Controls toolbar - stacked on mobile, side by side on larger screens */}
      <div className="flex flex-col w-full gap-3 mb-4 sm:mb-6">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-9 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <FaTimes size={12} />
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-40">
          <div className="relative">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="appearance-none w-full pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <FaFilter className="text-gray-400" size={12} />
            </div>
          </div>
          
          <div className="flex justify-between items-center gap-2 sm:gap-0">
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="appearance-none w-full pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <BiSortAlt2 className="text-gray-400" size={14} />
            </div>
          </div>
          
          {isAdmin && (
            <button
              onClick={openAddTaskModal}
              className="px-4 py-2 w-24 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transition-all shadow-sm hover:shadow flex items-center justify-center whitespace-nowrap text-sm"
            >
              <FaPlus className="mr-2 h-3 w-3" /> Add Task
            </button>
          )}
          </div>
        </div>
      </div>
      
      {/* Filter status bar - responsive layout */}
      {isFiltering && (
        <div className="mb-4 py-2 px-3 sm:px-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="text-xs sm:text-sm text-indigo-700 dark:text-indigo-300">
            <span className="font-medium">Filtered: </span> 
            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} found
            {searchTerm && <span className="ml-1 sm:ml-2">matching &quot;{searchTerm}&quot;</span>}
            {filterPriority !== 'all' && <span className="ml-1 sm:ml-2 capitalize">with {filterPriority} priority</span>}
          </div>
          <button 
            onClick={clearFilters}
            className="text-xs px-2 py-1 bg-white dark:bg-gray-700 rounded-md border border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800/30 w-full sm:w-auto text-center"
          >
            Clear Filters
          </button>
        </div>
      )}
      
      {/* Kanban Board with improved mobile layout */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 overflow-auto">
          {Object.keys(COLUMNS_CONFIG).map(columnId => (
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