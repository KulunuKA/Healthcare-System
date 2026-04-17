const express = require("express");
const { requireAuth } = require("../middlewares/authJwt");
// const { verifyWebhook } = require("../middlewares/webhookAuth"); // Comment this out for now
const paymentController = require("../controllers/paymentController");

const router = express.Router();

router.post("/initiate", paymentController.initiatePayment);
router.get("/:paymentId", requireAuth, paymentController.getPayment);

// REMOVE verifyWebhook here so PayHere can reach your controller without being blocked
router.post("/webhooks/:provider", paymentController.webhookPayment);

module.exports = router;