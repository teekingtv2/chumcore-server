const axios = require("axios");

exports.fetcher_ipinfo = async (ip) => {
  console.log("process.env.IPINFO_API", process.env.IPINFO_API);
  try {
    const response = await axios({
      method: "get",
      url: `${process.env.IPINFO_API}/${ip}?token=${process.env.IPINFO_TOKEN}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    console.log({ response_on_API: response });
    return response;
  } catch (error) {
    console.log(error);
    return error.response;
  }
};
