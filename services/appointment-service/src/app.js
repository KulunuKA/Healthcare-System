const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { requestId, logRequests, errorHandler, notFound } = require("@hc/shared");
const appointmentRoutes = require("./routes/appointmentRoutes");
const internalRoutes = require("./routes/internalRoutes");

function createApp({ appointmentSseBroadcaster } = {}) {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));

  app.use(requestId);
  app.use(logRequests);

  app.get("/health", (req, res) => res.json({ success: true, message: "appointment-service ok" }));

  app.use("/", appointmentRoutes({ appointmentSseBroadcaster }));
  app.use("/internal", internalRoutes({ appointmentSseBroadcaster }));

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };

