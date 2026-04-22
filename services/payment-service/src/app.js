const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { requestId, logRequests, errorHandler, notFound } = require("@hc/shared");
const paymentRoutes = require("./routes/paymentRoutes");

function createApp() {
  const app = express();
  
  app.use(helmet());
  app.use(cors());

  app.use(express.json({ limit: "10mb" }));

  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  app.use(requestId);
  app.use(logRequests);

  app.get("/health", (req, res) => res.json({ success: true, message: "payment-service ok" }));

  app.use("/", paymentRoutes);

  // Error handling
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };