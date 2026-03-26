const express = require("express");
const { registerRoute, loginRoute } = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerRoute);
router.post("/login", loginRoute);

module.exports = router;

