const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { requestId, logRequests, errorHandler, notFound } = require("@hc/shared");
const internalRoutes = require("./routes/internalRoutes");
const notificationRoutes = require('./routes/notificationRoutes');

function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));

  app.use(requestId);
  app.use(logRequests);

  app.get("/health", (req, res) => res.json({ success: true, message: "notification-service ok" }));
  
  app.use("/internal", internalRoutes);
  app.use("/notifications", notificationRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };

