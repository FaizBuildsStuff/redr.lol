import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(email: string, code: string, purpose: "signup" | "signin") {
  const subject = purpose === "signup" 
    ? "Verify your redr.lol account"
    : "Your redr.lol login code";

  const title = purpose === "signup"
    ? "Welcome to redr.lol"
    : "Login Verification";

  const message = purpose === "signup"
    ? "Use the code below to complete your registration."
    : "Use the code below to securely sign in to your account.";

  try {
    const { data, error } = await resend.emails.send({
      from: "redr.lol <onboarding@resend.dev>", // Must use onboarding@resend.dev for free testing
      to: email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
            body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; background-color: #050505; color: #F5F1E8; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; text-align: center; }
            .logo { font-size: 24px; font-weight: 600; margin-bottom: 40px; letter-spacing: -0.04em; }
            .logo span { color: #ef4444; }
            .card { background-color: #0A0A0A; border: 1px solid rgba(255,255,255,0.06); border-radius: 24px; padding: 40px; }
            .title { font-size: 20px; font-weight: 600; margin: 0 0 12px; }
            .message { color: #888; font-size: 15px; line-height: 1.6; margin: 0 0 32px; }
            .code-box { background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.2); border-radius: 16px; padding: 24px; margin-bottom: 32px; }
            .code { font-size: 36px; font-weight: 600; letter-spacing: 0.25em; color: #fff; margin: 0; }
            .footer { color: #555; font-size: 13px; margin-top: 40px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">redr<span>.lol</span></div>
            <div class="card">
              <h1 class="title">${title}</h1>
              <p class="message">${message}</p>
              <div class="code-box">
                <p class="code">${code}</p>
              </div>
              <p class="message" style="margin: 0; font-size: 13px;">This code will expire in 15 minutes.</p>
            </div>
            <div class="footer">
              If you didn't request this email, you can safely ignore it.
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error("Failed to send email");
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error sending OTP email:", err);
    throw err;
  }
}
