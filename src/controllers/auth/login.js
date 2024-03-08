const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");

const User = require("../../models/User");
const Schedule = require("../../models/Schedule");
const { generateAccessToken } = require("../../services/auth");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const [user] = await User.find({ username });

  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send("Username or password is incorrect.");
  }

  let fullAccess = "first-login";
  const schedule = await Schedule.findOne({ user: user._id });

  if (schedule) {
    if (
      Date.now() > schedule.toDate.getTime() ||
      Date.now() < schedule.fromDate.getTime()
    ) {
      // return res
      //   .status(StatusCodes.FORBIDDEN)
      //   .send("You are not allowed to login in this time period.");
      fullAccess = false;
    } else {
      fullAccess = true;
    }
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send("Username or password is incorrect.");
  }

  const accessTokenObject = schedule
    ? {
        ...user.toObject(),
        fromDate: schedule.fromDate,
        toDate: schedule.toDate,
        fullAccess,
      }
    : { ...user.toObject(), fullAccess };

  const accessToken = generateAccessToken(accessTokenObject);
  res.status(StatusCodes.OK).send({ accessToken });
};
