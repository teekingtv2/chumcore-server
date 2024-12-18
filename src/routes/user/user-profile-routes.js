const express = require("express");
const { register } = require("../../controllers/user/user-profile-controller");

const router = express.Router();

// Profile
router.post("/register", register);

module.exports = router;
