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
  name: {
    type: String,
  },
  agency: {
    type: String,
  },
  gstnumber: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  address: {
    type: String,
  },
  billduration: {
    type: String,
  },
  billtype: {
    type: String,
  },
  gsttype: {
    type: String,
  },
  number_message: {
    type: String,
  },
  name_message: {
    type: String,
  },
  customised_message: {
    type: String,
  },
  message_type: {
    type: String,
  },
  demo_message: {
    type: String,
  },
  prefix: {
    type: String,
  },
  accountholdername: {
    type: String,
  },
  accountstatus: {
    type: String,
  },
  accountnumber: {
    type: String,
  },

  bankIfsc: {
    type: String,
  },
  Pancardnumber: {
    type: String,
  },
  email: {
    type: String,
  },
  uploadPanCard: {
    type: String,
  },
  bankPassbookphoto: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
