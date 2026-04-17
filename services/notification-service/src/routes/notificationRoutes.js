const express = require("express");
const {
  createNotification,
  listNotifications,
  markAsRead,
} = require("../controllers/notificationController");
const router = express.Router();

// POST /internal/notifications
router.post("/", createNotification);

// GET /internal/notifications -> list for auth user
router.get("/", listNotifications);

// PUT /internal/notifications/:id/read -> mark as read
router.put("/:id/read", markAsRead);

module.exports = router;
