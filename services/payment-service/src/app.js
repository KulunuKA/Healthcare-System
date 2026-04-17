const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { requestId, logRequests, errorHandler, notFound } = require("@hc/shared");
const paymentRoutes = require("./routes/paymentRoutes");

function createApp() {
  const app = express();
  
  // Security and Cross-Origin headers
  app.use(helmet());
  app.use(cors());

  // 1. Parser for JSON data
  app.use(express.json({ limit: "10mb" }));

  // 2. Parser for URL-encoded data (REQUIRED for PayHere Webhooks)
  // This allows the server to read standard HTML form submissions
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Logging and tracing
  app.use(requestId);
  app.use(logRequests);

  // Health check route
  app.get("/health", (req, res) => res.json({ success: true, message: "payment-service ok" }));

  // Main payment routes
  app.use("/", paymentRoutes);

  // Error handling
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };