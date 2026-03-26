const express = require("express");
const { internalAuth } = require("../middlewares/internalAuth");
const {
  internalGetPatientMedical,
  internalAddPrescription,
  internalGetPatientProfile,
} = require("../controllers/internalController");

const router = express.Router();

router.use(internalAuth);
router.get("/patients/:patientId/medical", internalGetPatientMedical);
router.post("/patients/:patientId/prescriptions", internalAddPrescription);
router.get("/patients/:patientId/profile", internalGetPatientProfile);

module.exports = router;

