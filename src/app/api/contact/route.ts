import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validate inputs
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Configurable recipient email address
    const recipientEmails = (
      process.env.CONTACT_EMAIL ||
      process.env.CONTACT_RECEIVER_EMAIL ||
      process.env.OWNER_EMAIL ||
      "contact@gliaaurre.com"
    )
      .split(",")
      .map((addr) => addr.trim())
      .filter(Boolean);

    // Dispatch email
    await sendContactEmail({
      to: recipientEmails,
      name,
      email,
      phone,
      message,
    });

    return NextResponse.json(
      { success: true, message: "Your message has been sent successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[CONTACT_API_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error transmitting message." },
      { status: 500 }
    );
  }
}