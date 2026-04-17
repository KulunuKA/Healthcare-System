const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { requestId, logRequests, errorHandler, notFound } = require("@hc/shared");
const consultationRoutes = require("./routes/consultation.routes");
const telemedicineRequestRoutes = require("./routes/telemedicineRequest.routes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(requestId);
app.use(logRequests);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Telemedicine service is running complete",
  });
});

app.use("/api/consultations", consultationRoutes);
app.use("/requests", telemedicineRequestRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
