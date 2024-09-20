const {
  fetchSingleUser,
  fetchUsers,
  deleteUserProfile,
} = require("../controller/user/userController");
const catchAsync = require("../services/catchAsync");

const router = require("express").Router();

router.route("/").get(catchAsync(fetchUsers));
router.route("/:email").get(catchAsync(fetchSingleUser));
router.route("/deleteuser/:email").delete(catchAsync(deleteUserProfile));

module.exports = router;
