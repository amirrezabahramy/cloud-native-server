const { StatusCodes } = require("http-status-codes");
const hash = require("../../services/hash");

const User = require("../../models/User");

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, username, password, role } = req.body;
    const customer = new User({
      firstName,
      lastName,
      username,
      password: await hash(password),
      role,
    });
    await customer.save();
    res.status(StatusCodes.CREATED).send(customer);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error.message);
  }
};
