const express = require("express");
const { requireAuth } = require("../middlewares/authJwt");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

// NEW: Endpoint to fetch payment history for the logged-in patient
router.get("/history/me", requireAuth, paymentController.listMyPayments);

// Existing routes (Added requireAuth to /initiate for security)
router.post("/initiate", requireAuth, paymentController.initiatePayment);
router.get("/:paymentId", requireAuth, paymentController.getPayment);

// Webhooks remain public because PayHere calls them externally
router.post("/webhooks/:provider", paymentController.webhookPayment);

module.exports = router;