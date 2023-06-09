const express = require("express");
const router = express.Router();
const multer = require("multer");
const user = require("../services/user.service");
const product = require("../services/product.service");
const customer = require("../services/customer.service");
const agent = require("../services/agent.service");
const history = require("../services/histoy.service");
const upload = require("../services/upload.service");
const expenses = require("../services/expenses.service");
const month = require("../services/monthly.service");
require("../config/db");
const verifyToken = require("../middlware/auth");

//****************User Api************/
router.post("/register", user.createUser);
router.post("/login", user.loginUser);
router.get("/agentloginbyadmin/:number", verifyToken, user.agentLoginByAdmin);
router.get("/users", verifyToken, user.getUserByToken);
router.put(
  "/user-update",
  verifyToken,
  upload.fields([
    { name: "uploadPanCard", maxCount: 1 },
    { name: "bankPassbookphoto", maxCount: 1 },
    { name: "profileImg", maxCount: 1 },
  ]),
  user.editUser
);
router.get("/user-dashboard", verifyToken, user.dashboardData);
router.get("/single-user/:id", user.getUserById);

//************Product api*************/
router.post("/add-product", verifyToken, product.addProduct);
router.get("/products", verifyToken, product.getProduct);
router.delete("/delete-products/:id", product.deleteProduct);
router.get("/single-products/:id", product.singleProduct);
router.put("/update-product/:id", product.updateProduct);
router.get("/product-download", product.downloadProductSheet);
router.get("/download-pdf", product.downloadProductPdf);

//***********Customer Api*****************************************/
router.post("/add-customer", verifyToken, customer.addCutomer);
router.get("/customers", verifyToken, customer.getCustomer);
router.get("/single-customer/:id", customer.getsingleProduct);
router.put("/update-customer/:id", customer.UpdateCustomer);
router.put("/update-amount/:id", customer.UpdateCollectionAmount);
router.delete("/delete-customers/:id", customer.deleteCustomer);
router.get("/customer-download", customer.downloadCustomer);
router.get("/customer-monthly", customer.getCustomerMonthly);
router.get("/customer-totalcustomer", customer.getTotalCustomers);
router.put(
  "/update-custormer-status/:id",
  verifyToken,
  customer.updateCustomerStatus
);
router.put(
  "/update-customer-status-by-date/:id",
  verifyToken,
  customer.updateCUstomerStatusOnParticularDate
);

// *************Agent Api********************************************
router.post("/add-agent", verifyToken, agent.AddAgent);
router.get("/agents", verifyToken, agent.getAgent);
router.post("/agent-login", agent.loginAgent);
router.get("/agent-data", agent.agentData);
router.get("/single-agents/:id", agent.getSingleAgent);
router.put("/update-agent/:id", agent.updateAgent);
router.get("/total-agents", verifyToken, agent.totalAgent);
router.get("/agent-download", agent.downloadAgent);
router.get("/agent", verifyToken, agent.getAgentByToken);

//*******************Balance History*******+*******************/
router.get("/balance-history/:id", history.getBalanceHistory);
router.get("/balance-download", history.downloadBalanceSheet);
router.get("/total-paid", history.getTotalPaid);
router.get("/total-paid-online", history.getTotalPaidOnline);
router.get("/single-bill/:id", history.getsingleBill);

//****************************Monthly payment*****************************/
router.get("/monthly", month.calculateTransactionAmountSum);

//***************************Expenses*************************************/
router.post("/add-expenses", verifyToken, expenses.addExpenses);
router.get("/get-expenses", verifyToken, expenses.getExpenses);

module.exports = router;
