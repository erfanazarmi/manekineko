import nodemailer from "nodemailer";

export async function sendVerificationEmail(email: string, token: string) {
  const isProd = process.env.NODE_ENV === "production";
  const redirectUrl = isProd
    ? "https://manekineko.netlify.app"
    : "http://localhost:3000";

  const verifyUrl = `${redirectUrl}/verify-email?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Maneki Neko" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email",
    html: `<p>Please verify your email by clicking the link below:</p>
           <a href="${verifyUrl}">Verify Email</a>
           <p><small>This link will expire in 1 hour.</small></p>`,
  });
}
