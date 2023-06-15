// const BalanceHistory = require("../models/balanceHistory");

// exports.getBalanceMonthly = async (req, res) => {
//   const startOfCurrentMonth = new Date();
//   startOfCurrentMonth.setDate(1);

//   const startOfNextMonth = new Date();
//   startOfNextMonth.setDate(1);
//   startOfNextMonth.setMonth(startOfNextMonth.getMonth() + 1);

//   const transactionAmountSum = await BalanceHistory.aggregate([
//     {
//       $match: {
//         // Add any additional match criteria if needed
//         // postedBy: req.user._id,
//         createdAt: {
//           $gte: startOfCurrentMonth,
//           $lt: startOfNextMonth,
//         },
//       },
//     },
//     {
//       $group: {
//         _id: null,
//         totalAmount: {
//           $sum: "$transactionAmount",
//         },
//       },
//     },
//   ]);

//   if (transactionAmountSum.length > 0) {
//     const totalAmount = transactionAmountSum[0].totalAmount;
//     return res.status(200).json({ totalAmount: totalAmount });
//   } else {
//     return res.status(200).json({ totalAmount: 0 });
//   }
// };

const BalanceHistory = require("../models/balanceHistory");

const calculateTransactionAmountSum = async (req, res) => {
  try {
    const balanceHistories = await BalanceHistory.find(
      {},
      { transactionAmount: 1 }
    ).exec();

    const transactionAmounts = balanceHistories.map(
      (history) => history.transactionAmount
    );

    const sum = transactionAmounts.reduce(
      (accumulator, amount) => accumulator + amount,
      0
    );

    res.json({ sum });
  } catch (error) {
    console.error("Error retrieving balance histories:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  calculateTransactionAmountSum,
};
