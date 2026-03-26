const express = require("express");
const { internalAuth } = require("../middlewares/internalAuth");
const { createInternalAppointmentController } = require("../controllers/internalAppointmentController");

function createInternalRoutes({ appointmentSseBroadcaster } = {}) {
  const router = express.Router();
  const controller = createInternalAppointmentController({ appointmentSseBroadcaster });

  router.use(internalAuth);
  router.post("/appointments/:appointmentId/decision", controller.decision);
  router.get("/appointments/:appointmentId", controller.internalGetAppointment);

  return router;
}

module.exports = createInternalRoutes;

