import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import Task from '@/models/Task';
import User from '@/models/User';
// import Collab from '@/models/Collab';
import CollabParticipant from '@/models/CollabParticipant';

// GET all tasks for a collaboration
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const collabId = id; // Assuming this is the collaboration ID from the URL
    if (!collabId) {
      return NextResponse.json({ error: 'Collaboration ID is required' }, { status: 400 });
    } else{
        console.log("Collab ID:", collabId)
    }
    
    // Get the current user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Check if user has access to this collaboration
    const membership = await CollabParticipant.findOne({
      collabId: collabId,
      userId: user._id
    });
 
    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Fetch all tasks for this collaboration
    const tasks = await Task.find({ collabId })
      .sort({ updatedAt: -1 })
      .populate('createdBy', 'name email image')
      .lean();

    // Format task ids to strings for easier handling in frontend
    const formattedTasks = tasks.map(task => ({
      ...task,
      id: task._id.toString() // Add a string id field
    }));

    return NextResponse.json(formattedTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// POST create a new task
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const collabId = id;
    const { title, description, status, dueDate } = await request.json();

    // Get the current user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Check if user has access to this collaboration
    const membership = await CollabParticipant.findOne({
        collabId: collabId,
        userId: user._id
    });

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Create the task
    const task = new Task({
      title,
      description,
      status: status || 'todo',
      dueDate: dueDate || null,
      collabId,
      createdBy: user._id
    });

    await task.save();
    
    // Format response
    const formattedTask = {
      ...task.toObject(),
      id: task._id.toString(),
      createdBy: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image
      }
    };

    return NextResponse.json(formattedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}