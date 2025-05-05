import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import Task from '@/models/Task';
import User from '@/models/User';
import CollabParticipant from '@/models/CollabParticipant';
import mongoose from 'mongoose';

// Helper to check user access
async function checkUserAccess(collabId, userEmail) {
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    return null;
  }
  
  const membership = await CollabParticipant.findOne({
    collabId: collabId,
    userId: user._id
  });
  
  return membership ? user : null;
}

// GET a specific task
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id, taskid } = await params;
    const collabId = id;
    const taskId = taskid;
    
    // Check if user has access
    const user = await checkUserAccess(collabId, session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Validate taskId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    const task = await Task.findOne({
      _id: taskId,
      collabId
    }).populate('createdBy', 'name email image');

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Format response
    const formattedTask = {
      ...task.toObject(),
      id: task._id.toString()
    };

    return NextResponse.json(formattedTask);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

// PUT update a task
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id, taskid } = await params;
    const collabId = id;
    const taskId = taskid;
    const { title, description, status, dueDate, priority, assignee } = await request.json();
    
    // Check if user has access
    const user = await checkUserAccess(collabId, session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Validate taskId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, collabId },
      { 
        title, 
        description, 
        status,
        dueDate,
        priority,
        assignee,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('createdBy', 'name email image');

    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Format response
    const formattedTask = {
      ...updatedTask.toObject(),
      id: updatedTask._id.toString()
    };

    return NextResponse.json(formattedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE a task
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id, taskid } = await params;
    const collabId = id;
    const taskId = taskid;
    
    // Check if user has access
    const user = await checkUserAccess(collabId, session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Validate taskId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    const deletedTask = await Task.findOneAndDelete({
      _id: taskId,
      collabId
    });

    if (!deletedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}