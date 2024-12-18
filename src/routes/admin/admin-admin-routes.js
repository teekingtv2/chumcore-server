const express = require('express');
const { validateAdmin, validate } = require('../../middlewares/validator');
const { validateNewAdmin } = require('../../middlewares/admin');

const {
  addAdmin,
  updateAdminProfile,
  deleteAdmin,
  fetchAllAdmins,
  fetchSingleAdmin,
} = require('../../controllers/admin/admin-admin-controller');
const { verifyAdminLoginToken } = require('../../controllers/admin/admin-auth-controller');

const router = express.Router();

router.post(
  '/add-admin',
  verifyAdminLoginToken,
  validateAdmin,
  validate,
  validateNewAdmin,
  addAdmin
);

router.put('/update-admin-profile/:id', verifyAdminLoginToken, updateAdminProfile);
router.delete('/delete-admin/:id', verifyAdminLoginToken, deleteAdmin);
router.get('/fetch-all-admins', verifyAdminLoginToken, fetchAllAdmins);
router.get('/fetch-single-admin/:id', verifyAdminLoginToken, fetchSingleAdmin);

module.exports = router;
