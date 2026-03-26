function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

const config = {
  env: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 3003),
  MONGODB_URI: required("MONGODB_URI"),
  MONGODB_DB: required("MONGODB_DB"),
  JWT_SECRET: required("JWT_SECRET"),
  INTERNAL_SERVICE_TOKEN: required("INTERNAL_SERVICE_TOKEN"),
  DOCTOR_SERVICE_URL: process.env.DOCTOR_SERVICE_URL,
  NOTIFICATION_SERVICE_URL: process.env.NOTIFICATION_SERVICE_URL,
};

module.exports = config;

