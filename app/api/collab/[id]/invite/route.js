import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Collab from "@/models/Collab";
import CollabParticipant from "@/models/CollabParticipant";
import nodemailer from "nodemailer";

export async function POST(request, { params }) {
  try {
    // Get the current user session
    const userSession = await getServerSession(authOptions);

    if (!userSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to the database
    await dbConnect();

    // Parse the request body
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { id } = await params;
    const currentUser = await User.findOne({ email: userSession.user.email });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the collaboration exists
    const collab = await Collab.findById(id);

    if (!collab) {
      return NextResponse.json(
        { error: "Collaboration not found" },
        { status: 404 },
      );
    }

    // Check if user has permission to invite (must be admin or member)
    const participant = await CollabParticipant.findOne({
      collabId: id,
      userId: currentUser._id,
      role: { $in: ["ADMIN", "MEMBER"] },
    });

    if (!participant) {
      return NextResponse.json(
        {
          error:
            "You don't have permission to invite users to this collaboration",
        },
        { status: 403 },
      );
    }

    // Check if the invited user already exists
    const invitedUser = await User.findOne({ email });

    // Check if user is already in collaboration
    if (invitedUser) {
      const existingParticipant = await CollabParticipant.findOne({
        collabId: id,
        userId: invitedUser._id,
      });

      if (existingParticipant) {
        return NextResponse.json(
          { error: "User is already in this collaboration" },
          { status: 409 },
        );
      }
    }

    // Send invitation email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Create a simple invite link with code
    const inviteLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/collab/join-create?code=${collab.inviteCode}`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Coordly" <noreply@coordly.com>',
      to: email,
      subject: `Invitation to join "${collab.name}" on Coordly`,
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
                    <h2 style="color: #4a6fa5;">You've been invited to collaborate!</h2>
                    <p>Hello,</p>
                    <p>${currentUser.name || "Someone"} has invited you to join <strong>${collab.name}</strong> on Coordly.</p>
                    <div style="margin: 25px 0; text-align: center;">
                        <p style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Invite Code: <span style="color: #4a6fa5;">${collab.inviteCode}</span></p>
                        <a href="${inviteLink}" style="background-color: #4a6fa5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Join Collaboration</a>
                    </div>
                    <p style="color: #666; font-size: 14px;">If you don't have a Coordly account yet, you'll need to sign up first.</p>
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #e1e1e1;">
                    <p style="color: #999; font-size: 12px;">If you didn't expect this invitation, you can safely ignore this email.</p>
                </div>
            `,
      text: `
                Join "${collab.name}" on Coordly
                
                Hello,
                
                ${currentUser.name || "Someone"} has invited you to join "${collab.name}" on Coordly.
                
                Invite Code: ${collab.inviteCode}
                
                Join here: ${inviteLink}
                
                If you don't have a Coordly account yet, you'll need to sign up first.
                
                If you didn't expect this invitation, you can safely ignore this email.
            `,
    });

    return NextResponse.json({
      success: true,
      message: "Invitation sent successfully",
    });
  } catch (error) {
    console.error("Error inviting user:", error);
    return NextResponse.json(
      {
        error: "Failed to send invitation",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
