const router = require("express").Router();

router.route("/").post(function (req, res) {
  res.send("Signup route.");
});

module.exports = router;
