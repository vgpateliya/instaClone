const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");
const UserOTPVerification = mongoose.model("UserOTPVerification");
const { JWT_SECRET } = require("../config/keys");
const {
  emailValidator,
  passwordValidator,
} = require("../constants/validators");
const sendOTPVerification = require("../middleware/emailOTP");

var saltRounds = 12;

router.post("/signup", async (req, res) => {
  const { name, email, password, profilePic, verified } = await req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ error: "Empty Field Is Not Allowed!" });
  }
  await User.findOne({ email }).then((savedUser) => {
    if (savedUser) {
      return res.status(422).json({
        error: "User Already Exists  With Entered Email Address!",
      });
    }
    if (!emailValidator.Syntex.test(email)) {
      return res.status(422).json({ error: emailValidator.Message });
    }
    if (!passwordValidator.Syntex.test(password)) {
      return res.status(422).json({ error: passwordValidator.Message });
    }
    bcrypt.hash(password, saltRounds).then((hashedPassword) => {
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        verified,
        profilePic,
      });
      newUser.save().then((result) => {
        // sendOTPVerification(result, res);
        return res.status(201).json({
          message:
            "Account Created Successfully, Please Verify Your Email Address",
        });
      });
    });
  });
});

router.post("/verifyotp", async (req, res) => {
  let { userId, otp } = await req.body;
  if (!userId || !otp) {
    return res.status(422).json({ error: "Empty Field Is Not Allowed!" });
  } else {
    const UserOTPVerifyRecords = await UserOTPVerification.find({ userId });
    if (!UserOTPVerifyRecords) {
      return res
        .status(422)
        .json({ error: "OTP Does Not Exists!! Please SignIn or SignUp First" });
    } else {
      const hashedOTP = UserOTPVerifyRecords[0].otp;
      const validOTP = await bcrypt.compare(otp, hashedOTP);
      if (!validOTP) {
        return res
          .status(422)
          .json({ error: "Enterd OTP Is Invalid! Please Enter Valid OTP" });
      } else {
        await User.findOneAndUpdate({ _id: userId }, { verified: true });
        await UserOTPVerification.deleteMany({ userId });
        return res.status(201).json({
          message: "Account Verified Successfully",
        });
      }
    }
  }
});

router.post("/resendotp", async (req, res) => {
  let { userId, email } = await req.body;
  if (!userId || !email) {
    return res.status(422).json({ error: "Empty Field Is Not Allowed!" });
  } else {
    await UserOTPVerification.deleteMany({ userId });
    sendOTPVerification({ _id: userId, email }, res);
  }
});

router.post("/signin", async (req, res) => {
  const { email, password, verified } = await req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Empty Field Is Not Allowed!" });
  }
  if (!emailValidator.Syntex.test(email)) {
    return res.status(422).json({ error: emailValidator.Message });
  }
  await User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({
        error:
          "User Does Not Exists With Entered Email Address! Please Sign Up First!",
      });
    }
    // if (verified == true) {
    //   return res.status(422).json({
    //     error: "User Is Not Verified! Please Verify Your Email Address First!",
    //   });
    // }
    bcrypt.compare(password, savedUser.password).then((doMatch) => {
      if (!doMatch) {
        return res
          .status(422)
          .json({ error: "Please Enter Correct User Credentials!" });
      }
      const token = jwt.sign({ id: savedUser._id }, JWT_SECRET);
      const { _id, name, email, followers, following, profilePic } = savedUser;
      return res.status(201).json({
        message: "SignIn Successfully",
        token,
        user: { _id, name, email, followers, following, profilePic },
      });
    });
  });
});

module.exports = router;
