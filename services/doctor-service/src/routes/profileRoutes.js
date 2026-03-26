const express = require("express");
const { requireAuth, requireRole } = require("../middlewares/authJwt");
const { getProfile, updateProfile } = require("../controllers/profileController");

const router = express.Router();

router.use(requireAuth, requireRole("doctor"));
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

module.exports = router;

