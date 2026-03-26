const express = require("express");
const { requireAuth, requireRole } = require("../middlewares/authJwt");
const { createAppointmentController } = require("../controllers/appointmentController");

function createAppointmentRoutes({ appointmentSseBroadcaster } = {}) {
  const router = express.Router();
  const controller = createAppointmentController({ appointmentSseBroadcaster });

  router.get("/doctors/search", requireAuth, controller.searchDoctors);
  router.post("/appointments", requireAuth, requireRole("patient"), controller.bookAppointment);
  router.get("/appointments", requireAuth, controller.listMyAppointments);
  router.post("/appointments/:appointmentId/cancel", requireAuth, controller.cancelAppointment);
  router.get("/appointments/:appointmentId/status/stream", requireAuth, controller.statusStream);

  return router;
}

module.exports = createAppointmentRoutes;

