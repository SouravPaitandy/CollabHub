// filepath: c:\Users\soura\OneDrive\Desktop\CollabHub Project\collabhub\app\api\collab\[id]\chat\[messageId]\react\route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import Message from '@/models/Message';

export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { messageId } = params;
    const { emoji } = await request.json();
    const currentUser = session.user;

    const message = await Message.findById(messageId);
    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    let userPreviousReactionEmoji = null;

    // --- FIX: Find and remove any existing reaction from the current user ---
    message.reactions.forEach(reaction => {
      const userIndex = reaction.users.findIndex(u => u.email === currentUser.email);
      if (userIndex > -1) {
        userPreviousReactionEmoji = reaction.emoji;
        // Remove user from their previous reaction
        reaction.users.splice(userIndex, 1);
      }
    });

    // Clean up any reaction groups that are now empty
    message.reactions = message.reactions.filter(reaction => reaction.users.length > 0);

    // --- FIX: Add the new reaction only if it's not a toggle-off action ---
    if (userPreviousReactionEmoji !== emoji) {
      const newReactionIndex = message.reactions.findIndex(r => r.emoji === emoji);
      if (newReactionIndex > -1) {
        // The emoji group already exists, just add the user
        message.reactions[newReactionIndex].users.push({ email: currentUser.email, name: currentUser.name });
      } else {
        // The emoji group doesn't exist, create it
        message.reactions.push({ emoji, users: [{ email: currentUser.email, name: currentUser.name }] });
      }
    }

    await message.save();
    
    // Return the entire updated message
    return NextResponse.json(message);

  } catch (error) {
    console.error('Error handling reaction:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}