const BalanceHistory = require("../models/balanceHistory");
const exceljs = require("exceljs");

//******************** Get Balance History**************************************/
exports.getBalanceHistory = async (req, res) => {
  const id = req.params.id;
  try {
    const customer = await BalanceHistory.find({ customerId: id });
    if (!customer) {
      return res.status(404).json({ message: "customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ****************************Download List *****************************************/
exports.downloadBalanceSheet = async (req, res) => {
  try {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("My-Product");

    worksheet.columns = [
      { header: "S no.", key: "s_no" },
      { header: "CUSTOMER NAME", key: "name" },
      { header: "Bill Name", key: "name" },
      { header: "Date", key: "fromDate" },
      { header: "TXN_AMOUNT", key: "transactionAmount" },
      { header: "FINAL", key: "remainingAmount" },
    ];

    let count = 1;
    const productData = await BalanceHistory.find();
    productData.forEach((product) => {
      product.s_no = count;

      worksheet.addRow(product);
      count++;
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename=product.xlsx`);

    return workbook.xlsx.write(res).then(() => {
      res.status(200);
    });
  } catch (error) {
    console.log(error);
  }
};
