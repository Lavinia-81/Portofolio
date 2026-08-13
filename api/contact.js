// api/contact.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

   let rawBody = "";

  await new Promise((resolve) => {
    req.on("data", (chunk) => {
      rawBody += chunk;
    });
    req.on("end", resolve);
  });

  const { name, email, message } = JSON.parse(rawBody);

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
      from: process.env.SMTP_USER,
      to: process.env.RECEIVER_EMAIL,
      subject: `New message from ${name}`,
      text: `Email: ${email}\n\nMessage:\n${message}`
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
