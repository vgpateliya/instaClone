const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const requireLogin = require("../middleware/requireLogin");

router.post("/createpost", requireLogin, async (req, res) => {
  const { body, photo } = await req.body;
  if (!body || !photo) {
    return res.status(422).json({ error: "Please Add Some Content!" });
  }
  req.user.password = undefined;
  const createPost = new Post({ body, photo, postedBy: req.user });
  await createPost.save().then(() => {
    return res.status(201).json({ message: "Uploaded Post Successfully" });
  });
});

router.get("/allposts", requireLogin, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name profilePic")
    .populate("comments.postedBy", "_id name profilePic")
    .then((posts) => {
      return res.status(202).json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/getfollowposts", requireLogin, (req, res) => {
  Post.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name profilePic")
    .populate("comments.postedBy", "_id name profilePic")
    .then((posts) => {
      return res.status(202).json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/mypost", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name profilePic")
    .then((mypost) => {
      return res.status(200).json({ mypost });
    });
});

router.put("/like", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { likes: req.user._id } },
    { new: true }
  )
    .populate("postedBy", "_id name profilePic")
    .populate("comments.postedBy", "_id name profilePic")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        return res.status(200).json(result);
      }
    });
});

router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .populate("postedBy", "_id name profilePic")
    .populate("comments.postedBy", "_id name profilePic")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        return res.status(200).json(result);
      }
    });
});

router.put("/comment", requireLogin, (req, res) => {
  const comment = { text: req.body.text, postedBy: req.user._id };
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { comments: comment } },
    { new: true }
  )
    .populate("comments.postedBy", "_id name profilePic")
    .populate("postedBy", "_id name profilePic")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        return res.status(200).json(result);
      }
    });
});

router.delete("/deletepost/:postId", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      // console.log(post);
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post.remove().then((result) => {
          return res.status(200).json(result);
        });
      }
    });
});

router.delete("/deletecomment/:commentId", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.commentId })
    .populate("comments.postedBy", "_id")
    .populate("postedBy", "_id")
    .exec((err, comments) => {
      if (err || !comments) {
        return res.status(422).json({ error: err });
      }
      if (comments.postedBy._id.toString() === req.user._id.toString()) {
        comments.delete().then((result) => {
          return res.status(200).json(result);
        });
      }
    });
});

module.exports = router;
