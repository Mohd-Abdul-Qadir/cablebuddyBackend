const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  billingName: {
    type: String,
  },
  billingArea: {
    type: String,
  },
  billingNo: {
    type: String,
  },
  mobileNo1: {
    type: String,
  },
  mobileNo2: {
    type: String,
  },
  email: {
    type: String,
  },
  securityDeposit: {
    type: String,
  },
  address: {
    type: String,
  },
  gstNo: {
    type: String,
  },
  customerCode: {
    type: String,
  },
  remark: {
    type: String,
  },
  stbName: {
    type: String,
  },
  stbNumber: {
    type: String,
  },
  cardNumber: {
    type: String,
  },
  membershipNo: {
    type: String,
  },
  startDate: {
    type: String,
  },
  openingBalanceRadio: {
    type: String,
  },
  openingBalanceAmount: {
    type: String,
  },
  additionalChargeDiscount: {
    type: String,
  },
  additionalChargeRadio: {
    type: String,
  },
  billDurationRadio: {
    type: String,
  },
  billDurationSelect: {
    type: String,
  },
  billTypeRadio: {
    type: String,
  },
  gstTypeRadio: {
    type: String,
  },

  subdcriptionAmount: {
    type: String,
  },
  totalPayment: {
    type: String,
  },
  discountAmount: {
    type: String,
  },
  balanceAmount: {
    type: String,
  },
  userId: {
    type: String,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
