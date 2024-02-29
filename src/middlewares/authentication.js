const { StatusCodes } = require("http-status-codes");
const { verifyToken: verifyTokenService } = require("../services/auth");

const extractTokenFromRequest = (req) =>
  req.headers["authorization"].split(" ")[1] || "";

const verifyToken = (token, callback) => {
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).send("No token found.");
  }

  verifyTokenService(token, (error, user) => {
    if (error) {
      return res.status(StatusCodes.UNAUTHORIZED).send("Token is invalid.");
    }
    callback(user);
  });
};

exports.authenticateByRole = (roles) => (req, res, next) => {
  const token = extractTokenFromRequest(req);
  verifyToken(token, (user) => {
    if (!roles.includes(user.role)) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .send("You are not allowed to access this route.");
    }
    next();
  });
};

exports.authenticateById = (key) => (req, res, next) => {
  const token = extractTokenFromRequest(req);
  verifyToken(token, (user) => {
    if (!user._id === req.params[key]) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .send("You are not allowed to access this route.");
    }
    next();
  });
};
