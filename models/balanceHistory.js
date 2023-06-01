const mongoose = require("mongoose");

const balanceHistorySchema = new mongoose.Schema({
  fromDate: {
    type: Date,
    required: true,
  },
  toDate: {
    type: Date,
    required: true,
  },
  transactionAmount: {
    type: String,
    required: true,
  },
  remainingAmount: {
    type: String,
    required: true,
  },
  customerId: {
    type: String,
    required: true,
  },
  paymentMode: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  collectedBy: {
    type: String,
  },
});

const BalanceHistory = mongoose.model("BalanceHistory", balanceHistorySchema);

module.exports = BalanceHistory;
