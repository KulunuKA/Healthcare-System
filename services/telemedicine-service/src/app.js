const express = require("express");
const cors = require("cors");
const consultationRoutes = require("./routes/consultation.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Telemedicine service is running complete"
  });
});

app.use("/api/consultations", consultationRoutes);

module.exports = app;