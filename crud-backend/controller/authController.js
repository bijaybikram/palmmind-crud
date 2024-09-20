const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpgenerator = require("otp-generator");
const User = require("../model/userModel");
const sendEmail = require("../services/sendEmail");
require("dotenv").config();

exports.registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  // input validation for the incoming data
  if (!email || !userName || !password) {
    return res.status(401).json({
      message: "You need to fill up all the fields!",
    });
  }

  // checking user existence in the system
  const userFound = await User.find({ userEmail: email });
  if (userFound.length > 0) {
    return res.status(400).json({
      message: "User is already registered!",
    });
  }

  // User creation
  const userData = await User.create({
    userEmail: email,
    userName: userName,
    userPassword: bcrypt.hashSync(password, 10),
  });

  res.status(201).json({
    message: "User succesfully registered!",
    data: userData,
  });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({
      message: "please provide both the email and password",
    });
  }

  const userFound = await User.find({ userEmail: email }).select([
    "+userPassword",
  ]);

  if (userFound.length == 0) {
    return res.status(404).json({
      message: "No user is registered with these credetials",
    });
  }

  // check password matching
  const isMatch = bcrypt.compareSync(password, userFound[0].userPassword);
  if (isMatch) {
    const token = jwt.sign({ id: userFound[0]._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });
    res.status(200).json({
      message: "User logged in succesfully",
      data: userFound,
      token: token,
    });
  } else {
    res.status(404).json({
      message: "Invalid Password!",
    });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(401).json({
      message: "Please provide email",
    });
  }

  const userExist = await User.find({ userEmail: email });

  if (userExist.length == 0) {
    return res.status(404).json({
      message: "User with that email doesnot exist",
    });
  }

  // generate OTP using OTP generator module
  const generatedOtp = await otpgenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });

  userExist[0].otp = generatedOtp;
  userExist[0].otpGeneratedTime = Date.now();
  userExist[0].save();

  sendEmail({
    email: email,
    subject: "This is your OTP. Please keep it secure.",
    otp: generatedOtp,
  });
  res.status(200).json({
    message: "OTP sent succesfully",
  });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({
      message: "Please provide both the email and otp!",
    });
  }

  // double verify the otp and email relation
  const userExist = await User.find({
    userEmail: email,
  });
  if (userExist.length == 0) {
    return res.status(404).json({
      message: "Email is not registered.",
    });
  }

  if (userExist[0].otp !== otp) {
    res.status(400).json({
      message: "Invalid OTP",
    });
  } else {
    const currentTime = Date.now();
    if (currentTime - userExist[0].otpGeneratedTime <= 120000) {
      res.status(200).json({
        message: "OTP verified!",
      });
      userExist[0].otp = null;
      userExist[0].otpGeneratedTime = null;
      userExist[0].isOtpVerified = true;
      userExist[0].save();
    } else {
      res.status(400).json({
        message: "OTP timed out!",
      });
    }
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmNewPassword } = req.body;

  if (!email || !newPassword || !confirmNewPassword) {
    return res.status(401).json({
      message:
        "Please provide your email, new password and confirm new password",
    });
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({
      message: "newpassword and confirmnewpassword donot match!",
    });
  }

  const userExist = await User.find({ userEmail: email });

  if (userExist.length == 0) {
    return res.status(404).json({
      message: "Email is not registered!",
    });
  }

  if (userExist[0].isOtpVerified !== true) {
    return res.status(400).json({
      message: "Password already changed!",
    });
  }

  userExist[0].userPassword = bcrypt.hashSync(newPassword, 10);
  userExist[0].isOtpVerified = false;
  userExist[0].save();
  res.status(200).json({
    message: "Password changed succesfully!",
  });
};
exports.changeUsername = async (req, res) => {
  const { email, password, newUsername } = req.body;

  if (!email || !password || !newUsername) {
    return res.status(401).json({
      message: "Please provide your email, password and newUsername",
    });
  }

  const userExist = await User.find({ userEmail: email });

  if (userExist.length == 0) {
    return res.status(404).json({
      message: "User with that email doesnot exist",
    });
  }

  const isMatch = bcrypt.compareSync(password, userExist[0].userPassword);

  if (isMatch) {
    res.status(200).json({
      message: "Username changed succesfully!",
    });
    userExist[0].userName = newUsername;
    userExist[0].save();
  } else {
    res.status(400).json({
      message: "Invalid Password! You cannot change the userName.",
    });
  }
};

exports.deleteUserProfile = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({
      message: "Please provide your email, password",
    });
  }

  const userExist = await User.find({ userEmail: email });

  if (userExist.length == 0) {
    return res.status(404).json({
      message: "User with that email doesnot exist",
    });
  }

  const isMatch = bcrypt.compareSync(password, userExist[0].userPassword);

  if (isMatch) {
    res.status(200).json({
      message: "User Deleted succesfully!",
    });
    await User.deleteOne({ userEmail: email });
  }
};
