require("dotenv").config();
require("./db");
const express = require("express");
const requestIp = require("request-ip");

const generalRouter = require("./src/routes/admin/general-routes");
const userProfileRouter = require("./src/routes/user/user-profile-routes");

const adminAuthRouter = require("./src/routes/admin/admin-auth-routes");
const adminManagementRouter = require("./src/routes/admin/admin-admin-routes");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const { connect } = require("./db");

const app = express();
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://chumcore.vercel.app",
      "https://chumcore.io",
      "https://www.chumcore.io",
      "http://chumcore.io",
    ],
  })
);
app.use(requestIp.mw());
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));
app.use("/api/v1/user-profile", userProfileRouter);
app.use("/api/v1/admin-auth", adminAuthRouter);
app.use("/api/v1/admin-management", adminManagementRouter);
app.use("/api/v1/general", generalRouter);

app.get("/", (req, res) => {
  res.send("Hello, welcome to this API");
});

app.listen(process.env.APP_PORT || 7000, () => {
  connect();
  console.log(`Node version: ${process.version}`);
  // console.log(`Jest version: ${jest.version}`);
  console.log(`Listening to requests on port ${process.env.APP_PORT}`);
});
