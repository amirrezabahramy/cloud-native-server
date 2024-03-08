const { StatusCodes } = require("http-status-codes");
const Schedule = require("../models/Schedule");
const { verifyToken } = require("../services/auth");

exports.getSchedules = async function (req, res) {
  try {
    const schedules = await Schedule.find({}).populate("user");

    res.status(StatusCodes.OK).send(schedules);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error.message);
  }
};

exports.addSchedule = async function (req, res) {
  try {
    const { user, fromDate, toDate } = req.body;

    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).send("Token not found.");
    }

    verifyToken(token, (error, userFromToken) => {
      if (error) {
        return res.status(StatusCodes.UNAUTHORIZED).send("Token is not valid.");
      }

      if (user.role !== "admin" && userFromToken._id !== user) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .send("You are not allowed to modify other users schedules.");
      }
    });

    let schedule = await Schedule.findOne({ user });
    let statusCode;
    if (schedule) {
      schedule.toDate = toDate;
      schedule.fromDate = fromDate;
      statusCode = StatusCodes.OK;
    } else {
      schedule = new Schedule({ user, fromDate, toDate });
      statusCode = StatusCodes.CREATED;
    }

    await schedule.save();
    res.status(statusCode).send("Schedule post route.");
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error.message);
  }
};

exports.getSchedule = async function (req, res) {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).send("Token not found.");
    }

    verifyToken(token, (error, userFromToken) => {
      if (error) {
        return res.status(StatusCodes.UNAUTHORIZED).send("Token is not valid.");
      }

      if (user.role !== "admin" && userFromToken._id !== user) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .send("You are not allowed to modify other users schedules.");
      }
    });

    const schedule = await Schedule.findOne({ _id: req.params.id });

    res.status(StatusCodes.OK).send(schedule);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error.message);
  }
};

exports.editSchedule = async function (req, res) {
  try {
    const { fromDate, toDate } = req.body;
    console.log(fromDate, toDate);

    const schedule = await Schedule.findOne({ _id: req.params.scheduleId });

    if (!schedule) {
      return res.status(StatusCodes.BAD_REQUEST).send("Schedule not found.");
    }

    if (fromDate) {
      schedule.fromDate = fromDate;
    }

    if (toDate) {
      schedule.toDate = toDate;
    }

    await schedule.save();

    res.status(StatusCodes.OK).send(schedule);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error.message);
  }
};

exports.removeSchedules = async function (req, res) {
  try {
    const schedule = await Schedule.findOneAndDelete({
      _id: req.params.scheduleId,
    });

    if (!schedule) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Could not delete schedule.");
    }

    res
      .status(StatusCodes.ACCEPTED)
      .send(`Schedule with id ${req.params.scheduleId} has been deleted.`);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error.message);
  }
};
