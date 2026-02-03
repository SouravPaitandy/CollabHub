import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
      secure: process.env.EMAIL_SERVER_SECURE === "true",
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_SERVER_USER;

    // 1. Send notification to Admin/Support Team
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Coordly Support" <noreply@coordly.com>',
      to: adminEmail,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #4F46E5;">New Message Received</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <h3 style="margin-bottom: 10px;">Message:</h3>
          <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    // 2. Send confirmation to the User
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Coordly Support" <noreply@coordly.com>',
      to: email,
      subject: "We received your message!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
             <h1 style="color: #4F46E5;">Thanks for contacting Coordly!</h1>
          </div>
          <p>Hi ${name},</p>
          <p>We have received your message and our team will get back to you as soon as possible.</p>
          <p>Here's a copy of what you sent:</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; font-style: italic; color: #555;">
            "${message}"
          </div>
          <p>Best regards,<br/>The Coordly Team</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send message. Please try again later.",
      },
      { status: 500 },
    );
  }
}
