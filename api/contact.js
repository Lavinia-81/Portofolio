// api/contact.js
import nodemailer from "nodemailer";

export const config = {
  api: {
    bodyParser: true,
  },
};


export default async function handler(req, res) {
  console.log("API called, method:", req.method);
  
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("BODY:", req.body);
  const { name, email, message } = req.body;

   console.log("Parsed fields:", { name, email, message });

  console.log("SMTP_HOST:", process.env.SMTP_HOST);
  console.log("SMTP_USER:", process.env.SMTP_USER);
  console.log("SMTP_PASS:", process.env.SMTP_PASS ? "OK" : "MISSING");
  console.log("RECEIVER_EMAIL:", process.env.RECEIVER_EMAIL);

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }
  

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
    console.log("Email sent successfully");

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Eroare SMTP detaliată:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
