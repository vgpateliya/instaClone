const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const mongoose = require("mongoose");
const UserOTPVerification = mongoose.model("UserOTPVerification");
const { AUTH_EMAIL, AUTH_PASS } = require("../config/keys");
var saltRounds = 12;
// Nodemailer
let nodeConfig = {
  service: "gmail",
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASS,
  },
};

let transporter = nodemailer.createTransport(nodeConfig);

// Mailgen
let MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js",
  },
});

const sendOTPVerification = async ({ _id, email }, res) => {
  const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
  const hashedOTP = await bcrypt.hash(otp, saltRounds);
  const newOTPVerification = await new UserOTPVerification({
    userId: _id,
    otp: hashedOTP,
    createdAt: Date.now(),
  });
  await newOTPVerification.save();

  let otpEmail = {
    body: {
      name: "Instagram",
      intro: `Your Email Verification OTP is: ${otp} . It will expire in the next 15 minutes`,
      outro: "Happy to have you, Enjoy!",
    },
  };

  let mail = MailGenerator.generate(otpEmail);
  let respo = {
    from: AUTH_EMAIL,
    to: email,
    subject: "Verify your Email",
    html: mail,
  };
  await transporter.sendMail(respo);
  return res.status(200).json({
    message: `Account Created Successfully, Please Verify Your Email Address. OTP has been sent to your email: ${email}, your otp will expire in 15 minutes`,
    data: { userId: _id, email },
  });
};

module.exports = sendOTPVerification;
