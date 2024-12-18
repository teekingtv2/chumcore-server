const express = require("express");
const { validateAdminLoginType } = require("../../middlewares/admin");
const {
  isAdminLogin,
  logoutAdmin,
  loginAdmin,
  verifyAdminLoginToken,
  getAdmin,
  adminUpdateProfile,
} = require("../../controllers/admin/admin-auth-controller");

const router = express.Router();

router.post("/login", validateAdminLoginType, loginAdmin);

router.get("/get-admin", verifyAdminLoginToken, getAdmin);
router.put("/edit-profile", verifyAdminLoginToken, adminUpdateProfile);

router.get("/check-session", isAdminLogin);
router.post("/logout", logoutAdmin);

module.exports = router;
