const User = require("../../model/userModel");
const bcrypt = require("bcrypt");

exports.fetchUsers = async (req, res) => {
  const fetchedUsers = await User.find();
  if (fetchedUsers.length < 1) {
    return res.status(400).json({
      message: "Zero registered users!",
    });
  }

  res.status(200).json({
    message: "Users fetched succesfully",
    data: fetchedUsers,
  });
};

// fetch single user
exports.fetchSingleUser = async (req, res) => {
  const { email } = req.params;
  const fetchedUser = await User.find({ userEmail: email });
  if (fetchedUser.length == 0) {
    return res.status(400).json({
      message: "User not found!",
    });
  }

  res.status(200).json({
    message: "Users fetched succesfully",
    data: fetchedUser,
  });
};

exports.deleteUserProfile = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(401).json({
      message: "Please provide your email",
    });
  }

  const userExist = await User.find({ userEmail: email });

  if (userExist.length == 0) {
    return res.status(404).json({
      message: "User with that email doesnot exist",
    });
  }

  res.status(200).json({
    message: "User Deleted succesfully!",
  });
  await User.deleteOne({ userEmail: email });
};
