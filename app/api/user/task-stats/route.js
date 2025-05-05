import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import Task from '@/models/Task';
import CollabParticipant from '@/models/CollabParticipant';
// import mongoose from 'mongoose';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // Get the current user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Find all collaborations the user is part of
    const memberships = await CollabParticipant.find({ userId: user._id });
    const collabIds = memberships.map(membership => membership.collabId);
    
    // Get statistics for these collaborations
    const totalProjects = collabIds.length;
    
    // Get all tasks for these collaborations
    const tasks = await Task.find({ collabId: { $in: collabIds } });
    const totalTasks = tasks.length;
    
    // Count completed tasks (those with status "done")
    const completedTasks = tasks.filter(task => task.status === 'done').length;
    
    // Count tasks by priority (optional, for additional stats)
    const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;

    const tasksDueSoon = tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      return dueDate >= today && dueDate <= new Date(today.setDate(today.getDate() + 7));
    }).length;
    
    return NextResponse.json({
      totalProjects,
      totalTasks,
      completedTasks,
      highPriorityTasks,
      tasksDueSoon
    });
    
  } catch (error) {
    console.error('Error fetching task stats:', error);
    return NextResponse.json({ error: 'Failed to fetch task statistics' }, { status: 500 });
  }
}