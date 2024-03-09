const { StatusCodes } = require("http-status-codes");
const { hash } = require("../../services/hash");

const User = require("../../models/User");

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, username, password, role } = req.body;
    const user = new User({
      firstName,
      lastName,
      email,
      username,
      password: await hash(password),
      role,
    });
    await user.save();
    res.status(StatusCodes.CREATED).send(user);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error.message);
  }
};
