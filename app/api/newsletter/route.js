import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    // Parse the request body
    const { email } = await request.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid email address",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Configure email transporter
    // For production, use your actual SMTP credentials
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
      secure: process.env.EMAIL_SERVER_SECURE === "true",
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Email content for user confirmation
    const userMailOptions = {
      from: `${process.env.EMAIL_FROM || "noreply@coordly.com"}`,
      to: email,
      subject: "Welcome to Coordly Newsletter!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #6366f1;">Welcome to Coordly Newsletter!</h1>
            <div style="height: 4px; width: 100px; background: linear-gradient(to right, #6366f1, #a855f7); margin: 0 auto;"></div>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">Thank you for subscribing to our newsletter!</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">You'll now receive the latest updates on:</p>
          <ul style="font-size: 16px; line-height: 1.6; color: #4b5563;">
            <li>New collaboration features</li>
            <li>Product improvements</li>
            <li>Tips for better team productivity</li>
            <li>Special offers and events</li>
          </ul>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="https://collabhub-1.vercel.app/" style="background: linear-gradient(to right, #6366f1, #a855f7); color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">Visit Coordly</a>
          </div>
          
          <p style="font-size: 14px; color: #9ca3af; margin-top: 30px; text-align: center;">
            If you didn't request this subscription, you can 
            <a href="https://collabhub-1.vercel.app/unsubscribe?email=${email}" style="color: #6366f1; text-decoration: none;">unsubscribe</a> at any time.
          </p>
        </div>
      `,
    };

    // Email content for admin notification (optional)
    const adminMailOptions = {
      from: `${process.env.EMAIL_FROM || "noreply@coordly.com"}`,
      to: process.env.ADMIN_EMAIL || "admin@coordly.com",
      subject: "New Newsletter Subscription",
      text: `New user subscribed to the newsletter: ${email}`,
    };

    // Send emails
    await transporter.sendMail(userMailOptions);

    // Optional: notify admin about new subscription
    if (process.env.ADMIN_EMAIL) {
      await transporter.sendMail(adminMailOptions);
    }

    // Store in database (implement this part based on your database setup)
    // await db.newsletters.create({ email, subscribed_at: new Date() });

    return new Response(
      JSON.stringify({
        success: true,
        message:
          "Subscription successful! Check your email for confirmation. Now please sign in to your account or just create one.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message:
          "Failed to process subscription. Please try again later. You can give a try after signing in.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
