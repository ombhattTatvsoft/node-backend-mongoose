import config from '../../config/index.js';
import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, html, text }) {
  try {
    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure, // true for 465, false for other ports
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"${config.smtp.senderName}" <${config.smtp.user}>`,
      to,
      subject,
      html,
      text,
    });

    console.log(`✅ Email sent to ${to} — Message ID: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`❌ Failed to send email to ${to}:`, err);
    throw err;
  }
}
