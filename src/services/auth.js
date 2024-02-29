const jwt = require("jsonwebtoken");

exports.generateAccessToken = function (user) {
  return jwt.sign(user, process.env.APP_TOKEN_SECRET, { expiresIn: "1h" });
};

exports.verifyToken = function (token, callback) {
  return jwt.verify(token, process.env.APP_TOKEN_SECRET, callback);
};
