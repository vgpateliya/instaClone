const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userOTPVerificationSchema = new mongoose.Schema({
  userId: { type: ObjectId, ref: "User" },
  otp: { type: String, required: true },
  createdAt: { type: Date, expires: 900, default: Date.now() },
});

mongoose.model("UserOTPVerification", userOTPVerificationSchema);
