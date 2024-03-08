const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const Schedule = require("../models/Schedule");

exports.getUsers = async function (req, res) {
  try {
    const users = await User.find({});
    res.status(StatusCodes.OK).send(users);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error.message);
  }
};

exports.updateUser = async function (req, res) {
  try {
    const { firstName, lastName, email, role } = req.body;

    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      {
        firstName,
        lastName,
        email,
        role,
      }
    );

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).send("User not found.");
    }

    res.status(StatusCodes.OK).send(user);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error.message);
  }
};

exports.removeUser = async function (req, res) {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.userId });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).send(user);
    }

    await Schedule.findOneAndDelete({
      user: req.params.userId,
    });

    res
      .status(StatusCodes.OK)
      .send(`User with id ${req.params.userId} has been removed.`);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error.message);
  }
};
