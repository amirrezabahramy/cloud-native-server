const {
  addSchedule,
  getSchedules,
  editSchedule,
  getSchedule,
  removeSchedules,
} = require("../controllers/schedules");

const { authenticateByRole } = require("../middlewares/authentication");

const router = require("express").Router();

router
  .route("/")
  .get(authenticateByRole("admin"), getSchedules)
  .post(authenticateByRole("admin", "user"), addSchedule);
router
  .route("/:scheduleId")
  .get(authenticateByRole("admin", "user"), getSchedule)
  .patch(authenticateByRole("admin"), editSchedule)
  .delete(authenticateByRole("admin"), removeSchedules);

module.exports = router;
