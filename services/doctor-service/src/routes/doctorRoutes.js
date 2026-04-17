const express = require("express");
const { requireAuth, requireRole } = require("../middlewares/authJwt");
const doctorController = require("../controllers/doctorController");

const router = express.Router();

router.get("/doctors/:doctorId", doctorController.getDoctorById);
router.get("/doctors", doctorController.listDoctors);
router.put("/availability", requireAuth, requireRole("doctor"), doctorController.setAvailability);
router.post("/appointments/:appointmentId/decision", requireAuth, requireRole("doctor"), doctorController.decision);
router.get("/patients/:patientId/reports", requireAuth, requireRole("doctor"), doctorController.viewPatientReports);
router.post("/prescriptions/issue", requireAuth, requireRole("doctor"), doctorController.issuePrescription);

module.exports = router;

