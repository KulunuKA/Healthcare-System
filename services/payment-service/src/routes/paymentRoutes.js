const express = require("express");
const { requireAuth } = require("../middlewares/authJwt");
const { verifyWebhook } = require("../middlewares/webhookAuth");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

router.post("/initiate", requireAuth, paymentController.initiatePayment);
router.get("/:paymentId", requireAuth, paymentController.getPayment);
router.post("/webhooks/:provider", verifyWebhook, paymentController.webhookPayment);

module.exports = router;

