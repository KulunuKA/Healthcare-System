const express = require("express");
const { requireAuth } = require("../middlewares/authJwt");
const { requireSessionToken, requireSessionIdMatch } = require("../middlewares/sessionTokenAuth");
const { createTelemedicineController } = require("../controllers/telemedicineController");

function createTelemedicineRoutes() {
  const router = express.Router();
  const controller = createTelemedicineController();

  router.post("/sessions/start", requireAuth, controller.startSession);
  router.post(
    "/sessions/:sessionId/end",
    requireSessionToken,
    requireSessionIdMatch("sessionId"),
    controller.endSession
  );

  return router;
}

module.exports = { createTelemedicineRoutes };

