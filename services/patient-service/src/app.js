const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { requestId, logRequests, errorHandler, notFound } = require("@hc/shared");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const medicalRoutes = require("./routes/medicalRoutes");
const adminRoutes = require("./routes/adminRoutes");
const internalRoutes = require("./routes/internalRoutes");

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));

  app.use(requestId);
  app.use(logRequests);

  app.get("/health", (req, res) => res.json({ success: true, message: "patient-service ok" }));

  // Auth
  app.use("/auth", authRoutes);

  // Patient routes
  app.use("/me", profileRoutes);
  app.use("/me", medicalRoutes);

  // Admin routes
  app.use("/admin", adminRoutes);

  // Service-to-service routes
  app.use("/internal", internalRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };

