const express = require("express");
const {
  createNotification,
  listNotifications,
} = require("../controllers/notificationController");
const router = express.Router();

// POST /internal/notifications
router.post("/", createNotification);

// GET /internal/notifications -> list for auth user
router.get("/", listNotifications);

module.exports = router;
