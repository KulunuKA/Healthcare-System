const axios = require("axios");
const nodemailer = require("nodemailer");
const config = require("../config");

async function getPatientContact(patientId) {
  const url = `${config.PATIENT_SERVICE_URL}/internal/patients/${patientId}/profile`;
  const result = await axios.get(url, { headers: { "x-internal-token": config.INTERNAL_SERVICE_TOKEN } });
  return result.data?.data || result.data;
}

function createTransport() {
  if (!config.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: false,
    auth: config.SMTP_USER ? { user: config.SMTP_USER, pass: config.SMTP_PASS } : undefined,
  });
}

async function sendEmail({ to, subject, text }) {
  const transport = createTransport();
  if (!transport) {
    // eslint-disable-next-line no-console
    console.log(`[notification] SMTP not configured. Email to=${to} subject=${subject}`);
    return;
  }

  await transport.sendMail({
    from: config.FROM_EMAIL,
    to,
    subject,
    text,
  });
}

async function sendSmsMock({ to, text }) {
  // eslint-disable-next-line no-console
  console.log(`[notification] SMS mock sender=${config.SMS_SENDER} to=${to}: ${text}`);
}

module.exports = { getPatientContact, sendEmail, sendSmsMock };

