function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function optional(name, defaultValue = '') {
  const v = process.env[name];
  if (!v) {
    // eslint-disable-next-line no-console
    console.warn(`Optional env var not set: ${name} - using default`);
    return defaultValue;
  }
  return v;
}

const config = {
  env: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 3005),
  MONGODB_URI: required("MONGODB_URI"),
  MONGODB_DB: required("MONGODB_DB"),

  JWT_SECRET: required("JWT_SECRET"),
  INTERNAL_SERVICE_TOKEN: required("INTERNAL_SERVICE_TOKEN"),
  WEBHOOK_SECRET: required("WEBHOOK_SECRET"),

  // external service URLs can be optional in some deployments; warn if missing
  APPOINTMENT_SERVICE_URL: optional("APPOINTMENT_SERVICE_URL", ""),
  NOTIFICATION_SERVICE_URL: optional("NOTIFICATION_SERVICE_URL", ""),
  PAYHERE_MERCHANT_ID: optional("PAYHERE_MERCHANT_ID", "1234895"),
  PAYHERE_SECRET: optional("PAYHERE_SECRET", "MzY2MDMxNDUyMzE5MDI2MDIxOTE0MTkzNDU5NDYyMTc1MzY2MzI1Mw==")
};

module.exports = config;

