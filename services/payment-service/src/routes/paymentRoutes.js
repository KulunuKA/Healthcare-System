const express = require("express");
const { requireAuth } = require("../middlewares/authJwt");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

router.post("/initiate", paymentController.initiatePayment);
router.get("/:paymentId", requireAuth, paymentController.getPayment);

router.post("/webhooks/:provider", paymentController.webhookPayment);

module.exports = router;