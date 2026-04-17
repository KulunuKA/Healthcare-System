const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { requestId, logRequests, errorHandler, notFound } = require("@hc/shared");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const internalRoutes = require("./routes/internalRoutes");

function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(requestId);
  app.use(logRequests);

  app.get("/health", (req, res) => res.json({ success: true, message: "doctor-service ok" }));

  app.use("/auth", authRoutes);
  app.use("/me", profileRoutes);
  app.use("/", doctorRoutes);
  app.use("/internal", internalRoutes);

  // Backwards/compat: support API-gateway style prefixes too.
  app.use("/api/doctors/auth", authRoutes);
  app.use("/api/doctors/me", profileRoutes);
  app.use("/api/doctors", doctorRoutes);
  app.use("/api/doctors/internal", internalRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };

