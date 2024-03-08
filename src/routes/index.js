const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/schedules", require("./schedules"));
router.use("/users", require("./users"));

module.exports = router;
