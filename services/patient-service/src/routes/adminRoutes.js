const express = require("express");
const { requireAuth, requireRole } = require("../middlewares/authJwt");
const { listUsers, updateUserRole, verifyDoctor } = require("../controllers/adminController");

const router = express.Router();

router.use(requireAuth, requireRole("admin"));

router.get("/users", listUsers);
router.patch("/users/:patientId/role", updateUserRole);
router.post("/doctors/:doctorId/verify", verifyDoctor);

module.exports = router;

