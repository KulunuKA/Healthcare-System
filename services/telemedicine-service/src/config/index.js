/**
 * Central config for telemedicine-service (JWT must match gateway / other services).
 */
module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  /** Used by legacy session routes; falls back to JWT_SECRET if unset. */
  TELEMEDICINE_SECRET: process.env.TELEMEDICINE_SECRET || process.env.JWT_SECRET,
  PORT: Number(process.env.PORT) || 5005,
  /** Base URL to doctor-service (HTTP), e.g. http://localhost:4002 */
  DOCTOR_SERVICE_URL: (process.env.DOCTOR_SERVICE_URL || "").replace(/\/$/, ""),
};
