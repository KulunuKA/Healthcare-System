const env = process.env.NODE_ENV || "development";

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

const config = {
  env,
  PORT: Number(process.env.PORT || 3001),
  MONGODB_URI: required("MONGODB_URI"),
  MONGODB_DB: required("MONGODB_DB"),

  JWT_SECRET: required("JWT_SECRET"),
  INTERNAL_SERVICE_TOKEN: required("INTERNAL_SERVICE_TOKEN"),

  ALLOW_ADMIN_REGISTER: String(process.env.ALLOW_ADMIN_REGISTER || "false") === "true",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,

  UPLOAD_DIR: process.env.UPLOAD_DIR || "./uploads",

  DOCTOR_SERVICE_URL: process.env.DOCTOR_SERVICE_URL,
};

module.exports = config;

