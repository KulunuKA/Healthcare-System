function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

const config = {
  env: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 3004),
  MONGODB_URI: required("MONGODB_URI"),
  MONGODB_DB: required("MONGODB_DB"),
  JWT_SECRET: required("JWT_SECRET"), // used for user auth
  INTERNAL_SERVICE_TOKEN: required("INTERNAL_SERVICE_TOKEN"),
  TELEMEDICINE_SECRET: required("TELEMEDICINE_SECRET"),
};

module.exports = config;

