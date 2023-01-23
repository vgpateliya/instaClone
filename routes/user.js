const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Post = mongoose.model("Post");
const requireLogin = require("../middleware/requireLogin");

router.get("/user/:id", requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          return res.status(200).json({ user, posts });
        });
    });
});

router.put("/follow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: {
        followers: req.user._id,
      },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        { $push: { following: req.body.followId } },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          return res.status(200).json(result);
        });
    }
  );
});

router.put("/unfollow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: {
        followers: req.user._id,
      },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        { $pull: { following: req.body.unfollowId } },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          return res.status(200).json(result);
        });
    }
  );
});

router.put("/updatepic", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { profilePic: req.body.profilePic } },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({
          message: "There's Some Error Occured While Uploading Profile Picture",
          err,
        });
      }
      return res.status(200).json(result);
    }
  );
});

module.exports = router;
