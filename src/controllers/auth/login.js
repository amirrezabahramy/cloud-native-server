const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");

const User = require("../../models/User");
const { generateAccessToken } = require("../../services/auth");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const [user] = await User.find({ username });

  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).send("User not found");
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send("Username or password is incorrect.");
  }

  const accessToken = generateAccessToken(user.toObject());
  res.status(StatusCodes.OK).send({ accessToken });
};
