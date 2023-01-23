const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: { type: Boolean, default: false },
  profilePic: {
    type: String,
    default:
      "https://res.cloudinary.com/do73zkvlo/image/upload/v1672840822/pvvcgkeairod8jythdwu.jpg",
  },
  followers: [{ type: ObjectId, ref: "User" }],
  following: [{ type: ObjectId, ref: "User" }],
});

mongoose.model("User", userSchema);
