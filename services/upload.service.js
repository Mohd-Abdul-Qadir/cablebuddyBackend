const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Define the storage destination
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // Uploads folder where the files will be stored
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname); // File name will be a combination of the current timestamp and original file name
//   },
// });

module.exports = upload;
