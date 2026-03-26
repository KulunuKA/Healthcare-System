const express = require("express");
const { internalAuth } = require("../middlewares/internalAuth");
const { internalVerifyDoctor } = require("../controllers/internalController");

const router = express.Router();
router.use(internalAuth);
router.post("/doctors/:doctorId/verify", internalVerifyDoctor);

module.exports = router;

