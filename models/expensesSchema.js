const mongoose = require("mongoose");

const expensesSchema = new mongoose.Schema(
  {
    amount: {
      type: String,
    },
    category: {
      type: String,
    },
    commit: {
      type: String,
    },
    date: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Expenses = mongoose.model("Expenses", expensesSchema);

module.exports = Expenses;
