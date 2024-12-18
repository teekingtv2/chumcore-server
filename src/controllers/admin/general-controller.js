const { sendError, sendSuccess } = require("../../utils/helpers");
const User = require("../../models/user/User");

const fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find().limit(req.query.limit);
    return sendSuccess(res, "Successfully fetched users", users);
  } catch (err) {
    console.log(err);
    return sendError(res, `Unable to fetch users. Error - ${err}`);
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Successfully deleted the user profile",
    });
  } catch (err) {
    console.log(err);
    return sendError(res, "Unable to delete the user profile");
  }
};

module.exports = {
  fetchAllUsers,
  deleteUser,
};
