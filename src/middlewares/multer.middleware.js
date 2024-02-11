import multer from "multer";
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const uniqueName = uuidv4().toString() + path.extname(file.originalname);
    cb(null, uniqueName);
    // cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
});
