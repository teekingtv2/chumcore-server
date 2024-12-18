const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  sendError,
  createRandomBytes,
  sendSuccess,
} = require("../../utils/helpers");
const ResetPasswordToken = require("../../models/user/ResetPasswordToken");
const Admin = require("../../models/admin/Admin");

const adminUpdateProfile = async (req, res) => {
  const adminId = req.id;
  console.log("req.body", req.body);
  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return sendError(res, "You do not have a valid profile");
    }
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password);
    } else {
      req.body.password = admin.password;
    }
    const currentAdmin = await Admin.findByIdAndUpdate(
      adminId,
      { $set: req.body },
      { new: true }
    );
    return sendSuccess(
      res,
      "Your profile data has been successfully updated",
      currentAdmin
    );
  } catch (error) {
    console.log(err);
    return sendError(res, "Unable to update your profile data");
  }
};

// LOGIN
const loginAdmin = async (req, res, next) => {
  const { existingAdmin, password } = req.body;

  const isPasswordCorrect = bcrypt.compareSync(
    password,
    existingAdmin.password
  );
  if (!isPasswordCorrect) {
    return sendError(res, "Invalid email or password");
  }

  const token = jwt.sign(
    { id: existingAdmin._id },
    process.env.JWT_ADMIN_SECRET_KEY,
    {
      expiresIn: "15m",
    }
  );
  res.cookie(String(existingAdmin._id), token, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 15),
    httpOnly: true,
    sameSite: "lax",
    // sameSite: 'none',
    // secure: true,
  });
  return res.status(200).json({
    success: true,
    message: "Successfully logged in",
    id: existingAdmin._id,
    token,
  });
};

const isAdminLogin = async (req, res) => {
  const cookies = req.headers.cookie;
  if (cookies) {
    return res
      .status(200)
      .json({ success: true, message: "You are logged in" });
  } else if (!cookies) {
    return sendError(res, "No session found. You are not logged in", 401);
  }
};

const verifyAdminLoginToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  if (!cookies) {
    return sendError(
      res,
      "No session cookie. You are not authenticated for this operation",
      209
    );
  }
  let cook = cookies.split("; ")[1];
  if (!cook) {
    cook = cookies.split("; ")[0];
  }
  const token = cook.split("=")[1];
  if (!token) {
    return sendError(
      res,
      "No session token. You are not authenticated for this operation",
      209
    );
  }
  console.log("token:", token);
  jwt.verify(String(token), process.env.JWT_ADMIN_SECRET_KEY, (err, admin) => {
    if (err) {
      return sendError(res, "Invalid authorisation token", 209);
    }
    req.id = admin.id;
    next();
  });
};

const getAdmin = async (req, res) => {
  const adminId = req.id;
  let admin;
  try {
    admin = await Admin.findById(adminId, "-password");
    if (!admin) {
      return sendError(res, "Admin data not found");
    }
    return sendSuccess(res, "successfully fetched admin data", admin);
  } catch (err) {
    return sendError(res, err.message);
  }
};

const logoutAdmin = (req, res, next) => {
  console.log("Logout api called");
  const cookies = req.headers.cookie;
  if (!cookies) {
    return sendError(
      res,
      "No session cookie. You are not authenticated for this operation",
      205
    );
  }
  let cook = cookies.split("; ")[1];
  if (!cook) {
    cook = cookies.split("; ")[0];
  }
  const token = cook.split("=")[1];
  if (!token) {
    return sendError(res, "No token found", 205);
  }
  console.log({ token });
  jwt.verify(String(token), process.env.JWT_ADMIN_SECRET_KEY, (err, admin) => {
    if (err) {
      return sendError(res, "Invalid Token", 400);
      // return res.status(400).json({ message: "Invalid Token" })
    }
    res.clearCookie(`${admin.id}`);
    req.cookies[`${admin.id}`] = "";
    return res
      .status(200)
      .json({ success: true, message: "Successfully logged out" });
  });
};

module.exports = {
  loginAdmin,

  isAdminLogin,
  verifyAdminLoginToken,

  getAdmin,
  adminUpdateProfile,

  logoutAdmin,
};
