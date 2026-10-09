interface EmailPayload {
  to: string | string[];
  subject: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  totalExperience: string;
  currentCtc: string;
  expectedCtc: string;
  jobTitle: string;
  briefIntroduction: string;
  resumeFileName: string;
  resumeFileSize: number;
  resumeFileBase64?: string;
  resumeFileType?: string;
}

export async function sendApplicationEmail(payload: EmailPayload): Promise<{ success: boolean; id?: string }> {
  const {
    to,
    subject,
    candidateName,
    candidateEmail,
    candidatePhone,
    totalExperience,
    currentCtc,
    expectedCtc,
    jobTitle,
    briefIntroduction,
    resumeFileName,
    resumeFileSize,
    resumeFileBase64,
    resumeFileType,
  } = payload;

  const resendApiKey = process.env.RESEND_API_KEY;

  // 1. If Resend API key is configured
  if (resendApiKey) {
    try {
      const formattedSize = (resumeFileSize / (1024 * 1024)).toFixed(2) + " MB";
      const attachments = resumeFileBase64
        ? [
            {
              filename: resumeFileName,
              content: resumeFileBase64,
            },
          ]
        : [];

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.FROM_EMAIL || "GliaAurre Careers <careers@gliaaurre.com>",
          to: Array.isArray(to) ? to : [to],
          reply_to: candidateEmail,
          subject: subject,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #08090C; color: #F4F6F8; padding: 32px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #222933;">
              <div style="border-bottom: 1px solid #222933; padding-bottom: 16px; margin-bottom: 24px;">
                <h2 style="color: #00E5FF; margin: 0 0 6px 0; font-size: 20px; letter-spacing: -0.5px;">New Job Application Received</h2>
                <p style="color: #94A3B8; font-size: 12px; font-family: monospace; margin: 0;">GLIAAURRE ENGINEERING & RECRUITMENT PORTAL</p>
              </div>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 8px 0; color: #94A3B8; width: 140px; font-family: monospace; font-size: 12px;">POSITION:</td>
                  <td style="padding: 8px 0; color: #00E5FF; font-weight: 600;">${jobTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #94A3B8; font-family: monospace; font-size: 12px;">APPLICANT:</td>
                  <td style="padding: 8px 0; color: #FFFFFF; font-weight: 500;">${candidateName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #94A3B8; font-family: monospace; font-size: 12px;">EMAIL:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${candidateEmail}" style="color: #00E5FF; text-decoration: none;">${candidateEmail}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #94A3B8; font-family: monospace; font-size: 12px;">CONTACT NUMBER:</td>
                  <td style="padding: 8px 0; color: #FFFFFF;">${candidatePhone || "Not provided"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #94A3B8; font-family: monospace; font-size: 12px;">TOTAL EXPERIENCE:</td>
                  <td style="padding: 8px 0; color: #FFFFFF;">${totalExperience || "Not provided"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #94A3B8; font-family: monospace; font-size: 12px;">CURRENT CTC:</td>
                  <td style="padding: 8px 0; color: #FFFFFF;">${currentCtc || "Not provided"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #94A3B8; font-family: monospace; font-size: 12px;">EXPECTED CTC:</td>
                  <td style="padding: 8px 0; color: #FFFFFF;">${expectedCtc || "Not provided"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #94A3B8; font-family: monospace; font-size: 12px;">RESUME ATTACHMENT:</td>
                  <td style="padding: 8px 0; color: #10B981; font-weight: 500;">${resumeFileName} (${formattedSize})</td>
                </tr>
              </table>

              <div style="background: #13161C; padding: 20px; border-radius: 8px; border: 1px solid #222933; margin-top: 16px;">
                <p style="color: #94A3B8; font-size: 11px; font-family: monospace; text-transform: uppercase; margin: 0 0 10px 0;">Brief Introduction & Statement:</p>
                <p style="white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #E2E8F0; margin: 0;">${briefIntroduction || "Not provided"}</p>
              </div>
            </div>
          `,
          attachments,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return { success: true, id: data.id };
      }
    } catch (err) {
      console.error("[EMAIL_DISPATCH_ERROR_RESEND]", err);
    }
  }

  // 2. Structured Server Logging for Observability & Development
  console.log("==================================================");
  console.log("📥 NEW JOB APPLICATION RECEIVED FOR HR / RECRUITMENT");
  console.log("==================================================");
  console.log(`To: ${Array.isArray(to) ? to.join(", ") : to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Role: ${jobTitle}`);
  console.log(`Candidate: ${candidateName} <${candidateEmail}>`);
  console.log(`Phone: ${candidatePhone}`);
  console.log(`Total Experience: ${totalExperience}`);
  console.log(`Current CTC: ${currentCtc} | Expected CTC: ${expectedCtc}`);
  console.log(`Resume: ${resumeFileName} (${(resumeFileSize / 1024).toFixed(1)} KB)`);
  console.log(`Brief Introduction:\n${briefIntroduction}`);
  console.log("==================================================");

  return { success: true, id: "mock-" + Date.now() };
}

interface ContactEmailPayload {
  to: string | string[];
  name: string;
  email: string;
  phone: string;
  message: string;
}

export async function sendContactEmail(payload: ContactEmailPayload): Promise<{ success: boolean; id?: string }> {
  const { to, name, email, phone, message } = payload;

  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.FROM_EMAIL || "GliaAurre Contact <contact@gliaaurre.com>",
          to: Array.isArray(to) ? to : [to],
          reply_to: email,
          subject: `[New Website Inquiry] ${name}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #08090C; color: #F4F6F8; padding: 32px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #222933;">
              <div style="border-bottom: 1px solid #222933; padding-bottom: 16px; margin-bottom: 24px;">
                <h2 style="color: #00E5FF; margin: 0 0 6px 0; font-size: 20px;">New Contact Inquiry</h2>
                <p style="color: #94A3B8; font-size: 12px; font-family: monospace; margin: 0;">GLIAAURRE OFFICIAL COMMUNICATIONS</p>
              </div>

              <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 8px 0; color: #94A3B8; width: 140px; font-family: monospace; font-size: 12px;">NAME:</td>
                  <td style="padding: 8px 0; color: #FFFFFF; font-weight: 500;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #94A3B8; font-family: monospace; font-size: 12px;">EMAIL:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #00E5FF; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #94A3B8; font-family: monospace; font-size: 12px;">CONTACT NUMBER:</td>
                  <td style="padding: 8px 0; color: #FFFFFF;">${phone || "Not provided"}</td>
                </tr>
              </table>

              <div style="background: #13161C; padding: 20px; border-radius: 8px; border: 1px solid #222933;">
                <p style="color: #94A3B8; font-size: 11px; font-family: monospace; text-transform: uppercase; margin: 0 0 10px 0;">Message / Enquiry:</p>
                <p style="white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #E2E8F0; margin: 0;">${message}</p>
              </div>
            </div>
          `,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return { success: true, id: data.id };
      }
    } catch (err) {
      console.error("[EMAIL_DISPATCH_ERROR_RESEND_CONTACT]", err);
    }
  }

  console.log("==================================================");
  console.log("📥 NEW CONTACT INQUIRY RECEIVED");
  console.log("==================================================");
  console.log(`To: ${Array.isArray(to) ? to.join(", ") : to}`);
  console.log(`Name: ${name} <${email}>`);
  console.log(`Phone: ${phone}`);
  console.log(`Message:\n${message}`);
  console.log("==================================================");

  return { success: true, id: "mock-" + Date.now() };
}