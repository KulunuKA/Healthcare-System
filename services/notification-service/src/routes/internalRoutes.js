const express = require("express");
const { internalAuth } = require("../middlewares/internalAuth");
const { appointmentBooked, paymentSuccess } = require("../controllers/notificationController");

const router = express.Router();
router.use(internalAuth);

router.post("/appointment-booked", appointmentBooked);
router.post("/payment-success", paymentSuccess);

module.exports = router;

