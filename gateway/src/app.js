const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const { requestId, logRequests, errorHandler, notFound } = require("@hc/shared");
const { createJwtAuthMiddleware } = require("./middlewares/jwtAuth");
const { createProxiedRouter } = require("./routes/proxyRoutes");

dotenv.config();

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));

  app.use(requestId);
  app.use(logRequests);

  const jwtAuth = createJwtAuthMiddleware({
    jwtSecret: process.env.JWT_SECRET,
    publicRouteMatcher: (req) => {
      // Public auth endpoints
      if (req.path.startsWith("/api/patients/auth/")) return true;
      if (req.path.startsWith("/api/doctors/auth/")) return true;
      // Webhooks should be accessible without user JWT (they authenticate via provider secret)
      if (req.path.startsWith("/api/payments/webhooks/")) return true;
      if (req.path === "/health" || req.path === "/") return true;
      return false;
    },
  });

  app.use(jwtAuth);

  app.get("/health", (req, res) => res.json({ success: true, message: "gateway ok" }));
  app.get("/", (req, res) => res.json({ success: true, message: "gateway ok" }));

  // Proxies (REST)
  app.use(
    "/api/patients",
    createProxiedRouter({
      serviceUrl: process.env.PATIENT_SERVICE_URL,
      stripPrefix: "/api/patients",
    })
  );
  app.use(
    "/api/doctors",
    createProxiedRouter({
      serviceUrl: process.env.DOCTOR_SERVICE_URL,
      stripPrefix: "/api/doctors",
    })
  );
  app.use(
    "/api/appointments",
    createProxiedRouter({
      serviceUrl: process.env.APPOINTMENT_SERVICE_URL,
      stripPrefix: "/api/appointments",
    })
  );
  app.use(
    "/api/telemedicine",
    createProxiedRouter({
      serviceUrl: process.env.TELEMEDICINE_SERVICE_URL,
      stripPrefix: "/api/telemedicine",
    })
  );
  app.use(
    "/api/payments",
    createProxiedRouter({
      serviceUrl: process.env.PAYMENT_SERVICE_URL,
      stripPrefix: "/api/payments",
    })
  );
  app.use(
    "/api/notifications",
    createProxiedRouter({
      serviceUrl: process.env.NOTIFICATION_SERVICE_URL,
      stripPrefix: "/api/notifications",
    })
  );

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };

