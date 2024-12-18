const express = require("express");
const { fetchAllUsers } = require("../../controllers/admin/general-controller");
const {
  verifyAdminLoginToken,
} = require("../../controllers/admin/admin-auth-controller");
const router = express.Router();

router.get("/all-users", verifyAdminLoginToken, fetchAllUsers);

module.exports = router;
