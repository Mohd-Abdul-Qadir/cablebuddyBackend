const BalanceHistory = require("../models/balanceHistory");
const Customer = require("../models/customerSchema");
const exceljs = require("exceljs");
const moment = require("moment");

//Add customer ***************************************************************
exports.addCutomer = async (req, res) => {
  try {
    const {
      name,
      billingName,
      billingArea,
      billingNo,
      mobileNo1,
      mobileNo2,
      email,
      securityDeposit,
      address,
      gstNo,
      customerCode,
      remark,
      stbName,
      stbNumber,
      cardNumber,
      membershipNo,
      startDate,
      openingBalanceRadio,
      openingBalanceAmount,
      additionalChargeDiscount,
      additionalChargeRadio,
      billDurationRadio,
      billDurationSelect,
      billTypeRadio,
      gstTypeRadio,
      subdcriptionAmount,
      discountAmount,
      balanceAmount,
      totalPayment,
      selectedTags,
    } = req.body;

    if (!req.user) {
      return res.json({
        message: "Unauthorized request",
      });
    }
    const newCustomer = new Customer({
      name,
      billingName,
      billingArea,
      billingNo,
      mobileNo1,
      mobileNo2,
      email,
      securityDeposit,
      address,
      gstNo,
      customerCode,
      remark,
      stbName,
      stbNumber,
      cardNumber,
      membershipNo,
      startDate,
      openingBalanceRadio,
      openingBalanceAmount,
      additionalChargeDiscount,
      additionalChargeRadio,
      billDurationRadio,
      billDurationSelect,
      billTypeRadio,
      gstTypeRadio,
      subdcriptionAmount,
      totalPayment,
      discountAmount,
      balanceAmount,
      userId: req.user.id,
      selectedTags,
    });

    await newCustomer.save();
    res.status(201).json({ message: "Customer added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//Get Api *****************************************************************
exports.getCustomer = async (req, res) => {
  try {
    const id = req.user.id;
    const customers = await Customer.find({ userId: id });
    res.status(200).json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single Product Product *********************************************
exports.getsingleProduct = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update customer ***********************************************************
exports.UpdateCustomer = async (req, res) => {
  const customerId = req.params.id;
  const {
    name,
    billingName,
    billingArea,
    billingNo,
    mobileNo1,
    mobileNo2,
    email,
    securityDeposit,
    address,
    gstNo,
    customerCode,
    remark,
    stbName,
    stbNumber,
    cardNumber,
    membershipNo,
    startDate,
    openingBalanceRadio,
    openingBalanceAmount,
    additionalChargeDiscount,
    additionalChargeRadio,
    billDurationRadio,
    billDurationSelect,
    billTypeRadio,
    gstTypeRadio,
    subdcriptionAmount,
    totalPayment,
    discountAmount,
    balanceAmount,
  } = req.body;

  try {
    const updateCustomer = await Customer.findByIdAndUpdate(
      customerId,
      {
        name,
        billingName,
        billingArea,
        billingNo,
        mobileNo1,
        mobileNo2,
        email,
        securityDeposit,
        address,
        gstNo,
        customerCode,
        remark,
        stbName,
        stbNumber,
        cardNumber,
        membershipNo,
        startDate,
        openingBalanceRadio,
        openingBalanceAmount,
        additionalChargeDiscount,
        additionalChargeRadio,
        billDurationRadio,
        billDurationSelect,
        billTypeRadio,
        gstTypeRadio,
        subdcriptionAmount,
        totalPayment,
        discountAmount,
        balanceAmount,
      },
      { new: true }
    );

    if (!updateCustomer) {
      return res.status(404).json({ message: "customer not found" });
    }

    res.status(200).json({
      message: "customer updated successfully",
      customer: updateCustomer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.UpdateCollectionAmount = async (req, res) => {
  const customerId = req.params.id;
  const {
    transactionAmount,
    remainingAmount,
    fromDate,
    toDate,
    paymentMode,
    name,
    collectedBy,
    stbNo,
    cardNo,
  } = req.body;

  const balanceHistory = new BalanceHistory({
    customerId,
    fromDate,
    toDate,
    transactionAmount,
    remainingAmount,
    paymentMode,
    name,
    collectedBy,
    stbNo,
    cardNo,
  });

  await balanceHistory.save();

  try {
    const updateCustomer = await Customer.findByIdAndUpdate(
      customerId,
      {
        balanceAmount: remainingAmount,
      },
      { new: true }
    );

    if (!updateCustomer) {
      return res.status(404).json({ message: "customer not found" });
    }

    res.status(200).json({
      message: "customer updated successfully",
      customer: updateCustomer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//Delete Customer *********************************************************
exports.deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Download customer*******************************************************
exports.downloadCustomer = async (req, res) => {
  try {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("My-Product");

    worksheet.columns = [
      { header: "S no.", key: "s_no" },
      { header: "Name", key: "name" },
      { header: "Bill Name", key: "billingName" },
      { header: "Locality", key: "price" },
      { header: "Mobile", key: "mobileNo1" },
      { header: "Customer Code", key: "customerCode" },
      { header: "Billing Address", key: "address" },
      { header: "Balance Amount", key: "openingBalanceAmount" },
      { header: "Expiry Date", key: "" },
      { header: "Prepaid/Postpaid", key: "billTypeRadio" },
      { header: "Billing Interval", key: "billDurationSelect" },
      { header: "Plan Amount", key: "" },
      { header: "Sequence No", key: "securityDeposit" },
      { header: "Active/Inactive", key: "" },
      { header: "STB Name", key: "stbName" },
      { header: "Settop Box Number", key: "stbNumber" },
      { header: "Card Number", key: "cardNumber" },
      { header: "Membership Number", key: "membershipNo" },
      { header: "Products", key: "" },
      { header: "Quantity", key: "" },
      { header: "Additional Charge", key: "additionalChargeRadio" },
      { header: "Discount", key: "additionalChargeDiscount" },
    ];

    let count = 2012;
    const productData = await Customer.find();
    productData.forEach((product) => {
      product.s_no = count;

      worksheet.addRow(product);
      count++;
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename=customers.xlsx`);

    return workbook.xlsx.write(res).then(() => {
      res.status(200);
    });
  } catch (error) {
    console.log(error);
  }
};

//*******************************Monthly customer find*******************/
exports.getCustomerMonthly = async (req, res) => {
  try {
    const currentMonth = moment().format("MM");
    const currentYear = moment().format("YYYY");
    const customers = await Customer.find({
      createdAt: {
        $expr: {
          $and: [
            { $eq: [{ $month: "$createdAt" }, parseInt(currentMonth)] },
            { $eq: [{ $year: "$createdAt" }, parseInt(currentYear)] },
          ],
        },
      },
    });
    res.status(200).json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//****************Get Total customer ***********************************/
exports.getTotalCustomers = async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    res.status(200).json({ totalCustomers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
