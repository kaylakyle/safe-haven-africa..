require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 4000;

// Read SMTP config from env
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
const SMTP_SECURE = process.env.SMTP_SECURE === 'true'; // 'true' or 'false'
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || SMTP_USER;

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
  console.warn('Missing SMTP configuration. Please set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS in .env.');
}

// Create transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE || false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, body, html } = req.body;
    if (!to || (!body && !html) || !subject) {
      return res.status(400).json({ ok: false, error: 'Missing to/subject/body' });
    }

    const mailOptions = {
      from: FROM_EMAIL,
      to,
      subject,
      text: body,
      html: html || body.replace(/\n/g, '<br/>')
    };

    await transporter.sendMail(mailOptions);
    return res.json({ ok: true });
  } catch (err) {
    console.error('Failed to send email:', err);
    return res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Email relay running on http://localhost:${PORT}`);
});
