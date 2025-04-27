"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FaPlus, FaTimes, FaEdit, FaTrash, FaClipboardList } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

// Constants for status types to avoid typos
const STATUS = {
  TODO: 'todo',
  INPROGRESS: 'inprogress',
  REVIEW: 'review',
  DONE: 'done'
};

// Column configuration with colors
const COLUMNS_CONFIG = {
  [STATUS.TODO]: { 
    title: 'To Do',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
  },
  [STATUS.INPROGRESS]: { 
    title: 'In Progress',
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200'
  },
  [STATUS.REVIEW]: { 
    title: 'Review',
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200'
  },
  [STATUS.DONE]: { 
    title: 'Done',
    color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
  }
};

// Task modal component for adding/editing tasks
const TaskModal = ({ isOpen, onClose, task, onSubmit, isEditing }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [validationError, setValidationError] = useState('');

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setDueDate(task.dueDate || '');
    } else {
      // Reset form for new task
      setTitle('');
      setDescription('');
      setDueDate('');
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
    
    onSubmit({
      ...task,
      title,
      description,
      dueDate : dueDate || null // Send null if dueDate is empty string
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Title *</label>
            <input
              type="text"
              placeholder="Task title"
              className={`w-full p-2.5 border rounded-md dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                validationError ? 'border-red-500' : 'border-gray-300'
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
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              placeholder="Task description (optional)"
              className="w-full p-2.5 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Due Date</label>
            <input
              type="date"
              className="w-full p-2.5 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm hover:shadow transition-all"
            >
              {isEditing ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Task Card component
const TaskCard = ({ task, onEdit, onDelete, provided, snapshot }) => {
  const formattedDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : null;
  
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`p-4 mb-3 rounded-lg shadow-sm ${
        snapshot.isDragging ? 'shadow-md bg-indigo-50 dark:bg-indigo-900/30' : 'bg-white dark:bg-gray-800'
      } border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-medium text-gray-800 dark:text-gray-200">{task.title}</h4>
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 break-words">
              {task.description}
            </p>
          )}
          {formattedDate && (
            <div className="mt-3 text-xs inline-block px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              Due: {formattedDate}
            </div>
          )}
        </div>
        <div className="flex space-x-2 ml-2">
          <button 
            onClick={() => onEdit(task)}
            className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors p-1"
            aria-label="Edit task"
          >
            <FaEdit size={14} />
          </button>
          <button 
            onClick={() => onDelete(task._id)}
            className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors p-1"
            aria-label="Delete task"
          >
            <FaTrash size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Column component
const TaskColumn = ({ columnId, column, tasks, onEdit, onDelete }) => (
  <div 
    className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm overflow-hidden flex flex-col"
    key={columnId}
  >
    <h3 className={`font-medium py-3 px-4 ${COLUMNS_CONFIG[columnId].color} flex justify-between items-center`}>
      <span>{COLUMNS_CONFIG[columnId].title}</span>
      <span className="bg-white dark:bg-gray-800 text-xs font-bold px-2 py-1 rounded-full">
        {tasks.length}
      </span>
    </h3>
    
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`min-h-[250px] flex-grow p-3 ${
            snapshot.isDraggingOver 
              ? 'bg-blue-50/80 dark:bg-blue-900/20' 
              : 'bg-transparent'
          } transition-colors duration-200`}
        >
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
                />
              )}
            </Draggable>
          ))}
          {provided.placeholder}
          
          {tasks.length === 0 && (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-400 dark:text-gray-500 text-sm italic">
                {columnId === STATUS.TODO 
                  ? 'Add a task to get started' 
                  : 'Drag items here'}
              </p>
            </div>
          )}
        </div>
      )}
    </Droppable>
  </div>
);

// Loading component
const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center h-64 space-y-4">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    <p className="text-gray-600 dark:text-gray-400">Loading tasks...</p>
  </div>
);

// Error component
const ErrorDisplay = ({ message, onRetry }) => (
  <div className="text-red-500 p-5 bg-red-100 dark:bg-red-900/20 rounded-lg shadow-sm">
    <h3 className="font-semibold mb-2">Error loading tasks</h3>
    <p>{message}</p>
    <button 
      onClick={onRetry}
      className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-sm transition-colors"
    >
      Try Again
    </button>
  </div>
);

// Confirmation dialog
const ConfirmationDialog = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full">
        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Confirmation</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow transition-all"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Kanban Board component
const TaskBoard = ({ collabId }) => {
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
  
  // Function to organize tasks into columns
  const getColumnTasks = useCallback(() => {
    const columnTasks = {};
    
    Object.keys(COLUMNS_CONFIG).forEach(columnId => {
      columnTasks[columnId] = tasks.filter(task => 
        (task.status || STATUS.TODO) === columnId
      );
      console.log(`Tasks in ${columnId}:`, columnTasks[columnId]);
    });
    
    return columnTasks;
  }, [tasks]);

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
        status: task.status?.toLowerCase().replace(/\s+/g, '') || STATUS.TODO
      })) : [];
      console.log("Fetched tasks:", processedTasks);
      
      setTasks(processedTasks);
      console.log("Processed tasks:", tasks);
      setError(null);
      toast.success("Tasks loaded successfully");
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
      const response = await fetch(`/api/collab/${collabId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description,
          status: STATUS.TODO,
          dueDate: taskData.dueDate
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
          dueDate: taskData.dueDate
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
      
      toast.success(`Task moved to ${COLUMNS_CONFIG[destination.droppableId].title}`);
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={fetchTasks} />;
  }

  // Get tasks organized by column
  const columnTasks = getColumnTasks();
  // console.log("Column tasks:", columnTasks);
  // console.log("Tasks:", tasks);

  console.log("Column tasks:", columnTasks);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <FaClipboardList className="text-indigo-500 mr-3 text-2xl" />
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Task Board
          </h2>
        </div>
        <button
          onClick={openAddTaskModal}
          className="flex items-center px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors shadow-sm hover:shadow"
        >
          <FaPlus className="mr-2" /> Add Task
        </button>
      </div>
      
      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {Object.keys(COLUMNS_CONFIG).map(columnId => (
            <TaskColumn 
              key={columnId}
              columnId={columnId}
              column={COLUMNS_CONFIG[columnId]}
              tasks={columnTasks[columnId]}
              onEdit={openEditTaskModal}
              onDelete={confirmDeleteTask}
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
        message="Are you sure you want to delete this task?"
        onConfirm={handleDeleteTask}
        onCancel={cancelDeleteTask}
      />
    </div>
  );
};

export default TaskBoard;