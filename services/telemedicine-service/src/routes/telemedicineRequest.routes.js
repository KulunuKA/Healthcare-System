const express = require("express");
const { requireAuth, requireRole } = require("../middlewares/authJwt");
const controller = require("../controllers/telemedicineRequest.controller");

const router = express.Router();

router.post(
  "/",
  requireAuth,
  requireRole("patient"),
  controller.createRequest,
);

router.get(
  "/mine",
  requireAuth,
  requireRole("patient"),
  controller.listMine,
);

router.get(
  "/doctor",
  requireAuth,
  requireRole("doctor"),
  controller.listForDoctor,
);

router.get(
  "/admin",
  requireAuth,
  requireRole("admin"),
  controller.listForAdmin,
);

router.get("/:id", requireAuth, controller.getById);

router.patch(
  "/:id/accept",
  requireAuth,
  requireRole("doctor"),
  controller.accept,
);

router.patch(
  "/:id/reject",
  requireAuth,
  requireRole("doctor"),
  controller.reject,
);

router.patch(
  "/:id/cancel",
  requireAuth,
  requireRole("patient"),
  controller.cancel,
);

router.patch(
  "/:id/complete",
  requireAuth,
  requireRole("doctor"),
  controller.complete,
);

module.exports = router;
