function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

const config = {
  env: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 3006),

  MONGODB_URI: required("MONGODB_URI"),
  MONGODB_DB: required("MONGODB_DB"),

  INTERNAL_SERVICE_TOKEN: required("INTERNAL_SERVICE_TOKEN"),

  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: Number(process.env.SMTP_PORT || 587),
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
  FROM_EMAIL: process.env.FROM_EMAIL || "no-reply@example.test",
  SMS_SENDER: process.env.SMS_SENDER || "HealthSys",

  PATIENT_SERVICE_URL: required("PATIENT_SERVICE_URL"),
};

module.exports = config;

