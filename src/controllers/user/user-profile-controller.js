const { fetcher_ipinfo } = require("../../api/fetcher");
const User = require("../../models/user/User");
const { sendError, sendSuccess } = require("../../utils/helpers");

const register = async (req, res) => {
  console.log("endpoint called");
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return sendError(
        res,
        "You have already subscribed with this email address"
      );
    }
    const ip = req.clientIp;
    console.log({ ip });
    // const response = await fetcher_ipinfo("105.113.99.51");
    const response = await fetcher_ipinfo(ip);
    await console.log({ response });
    if (!response) {
      return sendError(
        res,
        "Unable to complete this request at this time. Please try again."
      );
    }
    if (response?.status === 200) {
      const data = response.data;
      req.body.location = `${data?.city}, ${data?.country}`;
      const newUser = new User(req.body);
      await newUser.save();
      return sendSuccess(res, "Successfully signed up! Thank you");
    }
  } catch (err) {
    console.log({ err });
    return sendError(res, err.message);
  }
};

module.exports = {
  register,
};
