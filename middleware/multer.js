const multer = require("multer");
// multer storage
const multerStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, `./client/public/uploads/`);
  },
  filename: (req, file, callback) => {
    const ext = file.mimetype.split("/")[1];
    callback(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
});

// multer filter
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      console.log({
        Status: 400,
        Error: "Not an image! Please upload images only!",
      }),
      false
    );
  }
};

// multer middleware
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
}).single("profilePic");
