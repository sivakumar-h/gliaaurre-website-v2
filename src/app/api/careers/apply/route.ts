import { NextResponse } from "next/server";
import { JOB_OPENINGS } from "@/lib/careers-data";
import { sendApplicationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = formData.get("name")?.toString()?.trim();
    const email = formData.get("email")?.toString()?.trim();
    const phone = formData.get("phone")?.toString()?.trim() || "";
    const totalExperience = formData.get("totalExperience")?.toString()?.trim() || "";
    const currentCtc = formData.get("currentCtc")?.toString()?.trim() || "";
    const expectedCtc = formData.get("expectedCtc")?.toString()?.trim() || "";
    const jobId = formData.get("jobId")?.toString()?.trim() || "";
    const briefIntroduction =
      formData.get("briefIntroduction")?.toString()?.trim() ||
      formData.get("message")?.toString()?.trim() ||
      "";
    const resumeFile = formData.get("resume") as File | null;

    // Validate essential fields
    if (!name || !email || !jobId) {
      return NextResponse.json(
        { error: "Please provide all required fields." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    if (!resumeFile) {
      return NextResponse.json(
        { error: "Please attach your resume file (PDF or DOC/DOCX)." },
        { status: 400 }
      );
    }

    // Determine target job title
    let jobTitle = "Mechanical Design Engineer";
    const foundJob = JOB_OPENINGS.find((j) => j.id === jobId || j.slug === jobId);
    if (foundJob) {
      jobTitle = foundJob.title;
    } else if (jobId === "general-inquiry") {
      jobTitle = "General Engineering Exploration";
    }

    // Convert file to base64 buffer for email attachment
    const arrayBuffer = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const resumeBase64 = buffer.toString("base64");

    // Configurable HR / recruitment email address
    const recipientEmails = (
      process.env.HR_EMAIL ||
      process.env.OWNER_EMAIL ||
      process.env.CONTACT_EMAIL ||
      "careers@gliaaurre.com"
    )
      .split(",")
      .map((addr) => addr.trim())
      .filter(Boolean);

    // Dispatch email to HR
    await sendApplicationEmail({
      to: recipientEmails,
      subject: `[New Application] ${name} - ${jobTitle}`,
      candidateName: name,
      candidateEmail: email,
      candidatePhone: phone,
      totalExperience: totalExperience,
      currentCtc: currentCtc,
      expectedCtc: expectedCtc,
      jobTitle: jobTitle,
      briefIntroduction: briefIntroduction,
      resumeFileName: resumeFile.name,
      resumeFileSize: resumeFile.size,
      resumeFileBase64: resumeBase64,
      resumeFileType: resumeFile.type,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[CAREERS_APPLY_API_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error submitting application." },
      { status: 500 }
    );
  }
}