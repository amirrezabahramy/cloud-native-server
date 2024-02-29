const bcrypt = require("bcrypt");

exports.hash = async function (password) {
  try {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    return error;
  }
};
