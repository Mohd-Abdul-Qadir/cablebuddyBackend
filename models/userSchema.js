const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  roll: {
    type: String,
    required: true,
  },
  business: {
    type: String,
  },
  number: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
