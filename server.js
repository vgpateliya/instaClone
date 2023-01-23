const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { MONGOURI } = require("./config/keys");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

mongoose.set("strictQuery", false);
mongoose.connect(MONGOURI);

mongoose.connection.on("connected", () => {
  console.log("Connection Success");
});
mongoose.connection.on("error", (err) => {
  console.log("Connection Error", err);
});

require("./models/user");
require("./models/post");
require("./models/otpVerification");

app.use(express.json());

// const bodyParser = require("express").json;
// app.use(bodyParser());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

if (process.env.NODE_ENV == "production") {
  const path = require("path");
  app.get("/", (req, res) => {
    app.use(express.static(path.resolve(__dirname, "client", "build")));
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
