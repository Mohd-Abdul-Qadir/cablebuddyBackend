const Customer = require("../models/customerSchema");
const BalanceHistory = require("../models/balanceHistory");

exports.getCustomer = async (req, res) => {
  try {
    const id = req.user.id;
    const customers = await Customer.find({ userId: id });

    // const tot

    res.status(200).json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
