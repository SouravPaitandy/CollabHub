import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import Document from '@/models/Document';
import User from '@/models/User';
import CollabParticipant from '@/models/CollabParticipant';

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

// GET all documents for a collab
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    
    // Check if user has access to this collaboration
    const user = await checkUserAccess(id, session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    
    // Fetch all documents for this collab
    const documents = await Document.find({ collabId: id })
      .sort({ updatedAt: -1 }) // Most recently updated first
      .select('title createdBy updatedAt createdAt lastEditedBy version');
    
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST create a new document
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const { title, content } = await request.json();

    // Get the current user
    const user = await checkUserAccess(id, session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    
    // Create the document
    const document = await Document.create({
      title,
      content,
      collabId: id,
      createdBy: user.email,
      lastEditedBy: user.email
    });
    
    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}