// netlify/functions/contact.js
import nodemailer from "nodemailer";
import xss from "xss";

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  const data = JSON.parse(event.body);

  // Honeypot anti-bot
  if (data.website) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  }

  // Sanitizare anti-XSS
  const name = xss(data.name);
  const email = xss(data.email);
  const phone = xss(data.phone || "");
  const subject = xss(data.subject || "New Message");
  const message = xss(data.message);

  if (!name || !email || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required fields" })
    };
  }

  // SMTP secure transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `New message from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Phone: ${phone}
Subject: ${subject}

Message:
${message}
      `
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    console.error("Email error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send email" })
    };
  }
}
