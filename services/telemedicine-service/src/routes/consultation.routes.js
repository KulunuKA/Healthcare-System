const express = require("express");
const router = express.Router();
const consultationController = require("../controllers/consultation.controller");

router.post("/", consultationController.createConsultation);
router.get("/:appointmentId", consultationController.getConsultationByAppointmentId);
router.put("/:id/start", consultationController.startConsultation);
router.put("/:id/end", consultationController.endConsultation);
router.put("/:id/prescription", consultationController.addPrescription);

module.exports = router;