const {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
  changeUsername,
  deleteUserProfile,
} = require("../controller/authController");
const catchAsync = require("../services/catchAsync");

const router = require("express").Router();

router.route("/register").post(catchAsync(registerUser));
router.route("/login").post(catchAsync(loginUser));
router.route("/forgotpassword").post(catchAsync(forgotPassword));
router.route("/verifyotp").post(catchAsync(verifyOtp));
router.route("/resetpassword").post(catchAsync(resetPassword));
router.route("/changeusername").patch(catchAsync(changeUsername));
// router.route("/deleteuser").delete(catchAsync(deleteUserProfile));

module.exports = router;
