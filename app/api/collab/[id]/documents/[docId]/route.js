// This route handles the API requests for a specific document in a collaboration
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

// GET a specific document
export async function GET(request, { params }) {
  try {
    const { id, docId } = await params;
    
    // Connect to MongoDB
    await dbConnect();
    
    // Find the document using Mongoose
    const document = await Document.findOne({
      _id: docId,
      collabId: id
    });
    
    if (!document) {
      return NextResponse.json({ message: "Document not found" }, { status: 404 });
    }
    
    // console.log('Document fetched:', document);
    
    // Return the document using NextResponse
    return NextResponse.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json({ message: "Failed to fetch document" }, { status: 500 });
  }
}

// PUT update a document
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id, docId } = await params;
    const { title, content } = await request.json();
    
    // Check if user has access to this collaboration
    const user = await checkUserAccess(id, session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    
    // Update the document
    const document = await Document.findOneAndUpdate(
      { _id: docId, collabId: id },
      { 
        title, 
        content, 
        lastEditedBy: user.email,
        updatedAt: new Date(),
        $inc: { version: 1 }
      },
      { new: true }
    );
    
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    
    return NextResponse.json(document);
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a document
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id, docId } = await params;
    
    // Get the user
    const user = await User.findOne({ email: session.user.email });
    
    // Check if user has admin access or is the document creator
    const document = await Document.findOne({ _id: docId, collabId: id });
    
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    
    const isAdmin = await CollabParticipant.findOne({
      collabId: id,
      userId: user._id,
      role: 'ADMIN'
    });
    
    // Only admins or document creators can delete
    if (!isAdmin && document.createdBy !== session.user.email) {
      return NextResponse.json({ error: 'Permission denied to delete this document' }, { status: 403 });
    }
    
    // Delete the document
    await Document.findByIdAndDelete(docId);
    
    return NextResponse.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}