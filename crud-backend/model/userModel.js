const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: [true, "Email must be provided!"],
      unique: true,
      lowercase: true,
    },
    userName: {
      type: String,
      required: [true, "username must be provided!"],
    },
    userPassword: {
      type: String,
      required: [true, "Password must be provided!"],
    },
    otp: {
      type: String,
    },
    otpGeneratedTime: {
      type: Date,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
