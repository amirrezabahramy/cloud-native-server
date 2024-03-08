const router = require("express").Router();

const { getUsers, updateUser, removeUser } = require("../controllers/users");
const { authenticateByRole } = require("../middlewares/authentication");

router.route("/").get(authenticateByRole("admin"), getUsers);
router
  .route("/:userId")
  .patch(authenticateByRole("admin"), updateUser)
  .delete(authenticateByRole("admin"), removeUser);

module.exports = router;
