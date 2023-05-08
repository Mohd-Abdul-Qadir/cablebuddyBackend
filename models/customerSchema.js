const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  billing: {
    type: String,
  },
  area: {
    type: String,
    required: true,
    unique: true,
  },
  no: {
    type: String,
    required: true,
  },
  product: {
    type: String,
    required: true,
  },
  number1: {
    type: String,
    required: true,
  },
  number2: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  deposit: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  gst: {
    type: String,
    required: true,
  },
  remark: {
    type: String,
    required: true,
  },
  stbName: {
    type: String,
    required: true,
  },
  stbNumber: {
    type: String,
    required: true,
  },
  cardNumber: {
    type: String,
    required: true,
  },
  membership: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  balance: {
    type: String,
    required: true,
  },
  AdditionalCharg: {
    type: String,
    required: true,
  },
  billDuration: {
    type: String,
    required: true,
  },
  billType: {
    type: String,
    required: true,
  },
  gstType: {
    type: String,
    required: true,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
