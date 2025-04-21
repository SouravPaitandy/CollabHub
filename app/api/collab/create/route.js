import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from "@/lib/mongoose";
import Collab from "@/models/Collab";
import CollabParticipant from "@/models/CollabParticipant";
import User from "@/models/User";
import crypto from 'crypto';

export async function POST(request) {
  const userSession = await getServerSession(authOptions);
  
  if (!userSession) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    // Parse request body
    const reqBody = await request.json();
    
    // Extract necessary data
    const { name, description, githubRepoId, githubRepoUrl } = reqBody;
    
    if (!name) {
      return NextResponse.json({ message: 'Collaboration name is required' }, { status: 400 });
    }
    
    // Generate an invite code
    const inviteCode = crypto.randomBytes(4).toString('hex');

    // Fetch the user from the database
    const user = await User.findOne({ email: userSession.user.email });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Create the collaboration
    const collab = await Collab.create({
      name,
      description: description || `Collaboration for ${name}`,
      inviteCode,
      createdBy: user._id,
      // Add GitHub specific fields if they exist
      ...(githubRepoId && { githubRepoId }),
      ...(githubRepoUrl && { githubRepoUrl })
    });

    // Add the creator as an admin
    await CollabParticipant.create({
      userId: user._id,
      collabId: collab._id,
      collabName: collab.name,
      role: 'ADMIN'
    });

    return NextResponse.json({
      message: 'Collab created successfully',
      collabId: collab._id.toString(),
      inviteCode
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating collab:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}