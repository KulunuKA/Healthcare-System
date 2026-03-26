const express = require("express");
const { requireAuth } = require("../middlewares/authJwt");
const { upload } = require("../middlewares/multer");
const { uploadReports, getMedicalHistory, getPrescriptions } = require("../controllers/medicalController");

const router = express.Router();

router.post("/reports", requireAuth, upload.fields([{ name: "documents", maxCount: 10 }]), uploadReports);
router.get("/medical-history", requireAuth, getMedicalHistory);
router.get("/prescriptions", requireAuth, getPrescriptions);

module.exports = router;

