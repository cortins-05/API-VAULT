// src/lib/sendEmail.ts
import nodemailer from "nodemailer";

// Transporter Ethereal (para desarrollo)
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: process.env.ETHEREAL_USER, 
    pass: process.env.ETHEREAL_PASS,
  },
});

export async function sendEmail({ to, subject, text, html }: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  const info = await transporter.sendMail({
    from: `"API-VAULT" <${process.env.ETHEREAL_USER}>`,
    to,
    subject,
    text,
    html,
  });

  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
}
