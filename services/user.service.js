const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const config = require("../config/config");
const Agent = require("../models/agentSchema");
const Customer = require("../models/customerSchema");
const BalanceHistory = require("../models/balanceHistory");
require("../config/db");

// User register api **************************************
exports.createUser = async (req, res) => {
  const {
    roll,
    business,
    number,
    password,
    name,
    agency,
    gstnumber,
    state,
    city,
    address,
    billduration,
    billtype,
    gsttype,
    number_message,
    name_message,
    customised_message,
    message_type,
    demo_message,
    prefix,
    accountholdername,
    accountstatus,
    accountnumber,
    bankIfsc,
    Pancardnumber,
    email,
    uploadPanCard,
    bankPassbookphoto,
  } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ number: number });

  if (existingUser) {
    return res.status(400).send("User already exists");
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new user
  const user = new User({
    roll,
    business,
    number,
    password: hashedPassword,
    name,
    agency,
    gstnumber,
    state,
    city,
    address,
    billduration,
    billtype,
    gsttype,
    number_message,
    name_message,
    customised_message,
    message_type,
    demo_message,
    prefix,
    accountholdername,
    accountstatus,
    accountnumber,
    bankIfsc,
    Pancardnumber,
    email,
    uploadPanCard,
    bankPassbookphoto,
    profileImg,
  });

  try {
    // Save the user to the database
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
};

// login api ********************************************************************
exports.loginUser = async (req, res) => {
  try {
    console.log(req.body);
    const { number, password } = req.body;

    const user = await User.findOne({ number: number });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    jwt.sign(payload, config.secret, { expiresIn: "7h" }, (err, token) => {
      if (err) throw err;
      console.log(token, "token ");
      res.json({ message: "Login successful", token });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

exports.agentLoginByAdmin = async (req, res) => {
  try {
    const { number } = req.params;
    const agent = await Agent.findOne({ number: number });
    if (!agent && agent.userId !== req.user._id)
      return res.status(500).json({ error: "Agent not found" });
    const payload = {
      id: agent._id,
      name: agent.name,
      userId: agent.userId,
      number: agent.number,
    };
    jwt.sign(payload, config.secret, { expiresIn: "7h" }, (err, token) => {
      if (err) throw err;
      res.json({ message: "Agent login successful", token });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

exports.dashboardData = async (req, res) => {
  try {
    const dashboard = {
      monthlyTotalCollection: 0,
      todayTotalCollection: 0,
      totalPendingAmount: 0,
      totalOnlineCollection: 0,
      totalCustomer: 0,
      totalActiveCustomer: 0,
      totalInActiveCustomer: 0,
      thisMonthNewCustomer: 0,
    };
    // const agents = await Agent.find({ userId: req.user.id });
    // TODO: fetch customers created by agents
    const customers = await Customer.find({ userId: req.user.id }); // customer created by adming
    dashboard.totalCustomer = customers.length;
    dashboard.totalActiveCustomer = customers.length;
    const balanceHistoryOfCustomers = await Promise.all(
      customers.map((customer) => {
        return BalanceHistory.find({
          customerId: customer._id,
        });
      })
    );

    res.json({ user: balanceHistoryOfCustomers });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Edit api *****************************************************************************
// exports.editUser = async (req, res) => {
//   const { uploadPanCard, bankPassbookphoto } = req.files;

//   const userId = req.user.id;
//   const {
//     business,
//     number,
//     name,
//     agency,
//     gstnumber,
//     state,
//     city,
//     address,
//     billduration,
//     billtype,
//     gsttype,
//     number_message,
//     name_message,
//     customised_message,
//     message_type,
//     demo_message,
//     prefix,
//     accountholdername,
//     accountstatus,
//     accountnumber,
//     bankIfsc,
//     Pancardnumber,
//     email,
//   } = req.body;

//   try {
//     const userUpdate = await User.findByIdAndUpdate(
//       userId,
//       {
//         business,
//         number,
//         name,
//         agency,
//         gstnumber,
//         state,
//         city,
//         address,
//         billduration,
//         billtype,
//         gsttype,
//         number_message,
//         name_message,
//         customised_message,
//         message_type,
//         demo_message,
//         prefix,
//         accountholdername,
//         accountstatus,
//         accountnumber,
//         bankIfsc,
//         Pancardnumber,
//         email,
//         uploadPanCard: uploadPanCard[0].path,
//         bankPassbookphoto: bankPassbookphoto[0].path,
//       },
//       { new: true }
//     );

//     if (!userUpdate) {
//       return res.status(404).send("User not found");
//     }
//     res.status(200).json({
//       message: "user Update successfull",
//       user: userUpdate,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(400).send(err);
//   }
// };

// exports.editUser = async (req, res) => {
//   const { uploadPanCard, bankPassbookphoto, profileImg } = req.files;

//   // if (
//   //   !uploadPanCard ||
//   //   !uploadPanCard[0] ||
//   //   !bankPassbookphoto ||
//   //   !bankPassbookphoto[0]
//   // ) {
//   //   return res
//   //     .status(400)
//   //     .send("Please upload both uploadPanCard and bankPassbookphoto files");
//   // }

//   // if (!uploadPanCard || !uploadPanCard[0]) {
//   //   return res.status(400).send("Please upload the profileImg file");
//   // }

//   // if (!bankPassbookphoto || !bankPassbookphoto[0]) {
//   //   return res.status(400).send("Please upload the profileImg file");
//   // }

//   // if (!profileImg || !profileImg[0]) {
//   //   return res.status(400).send("Please upload the profileImg file");
//   // }
//   const userId = req.user.id;
//   const {
//     business,
//     number,
//     name,
//     agency,
//     gstnumber,
//     state,
//     city,
//     address,
//     billduration,
//     billtype,
//     gsttype,
//     number_message,
//     name_message,
//     customised_message,
//     message_type,
//     demo_message,
//     prefix,
//     accountholdername,
//     accountstatus,
//     accountnumber,
//     bankIfsc,
//     Pancardnumber,
//     email,
//   } = req.body;

//   try {
//     const userUpdate = await User.findByIdAndUpdate(
//       userId,
//       {
//         business,
//         number,
//         name,
//         agency,
//         gstnumber,
//         state,
//         city,
//         address,
//         billduration,
//         billtype,
//         gsttype,
//         number_message,
//         name_message,
//         customised_message,
//         message_type,
//         demo_message,
//         prefix,
//         accountholdername,
//         accountstatus,
//         accountnumber,
//         bankIfsc,
//         Pancardnumber,
//         email,
//         uploadPanCard: uploadPanCard[0].path,
//         bankPassbookphoto: bankPassbookphoto[0].path,
//         profileImg: profileImg[0].path,
//       },
//       { new: true }
//     );

//     if (!userUpdate) {
//       return res.status(404).send("User not found");
//     }
//     res.status(200).json({
//       message: "User update successful",
//       user: userUpdate,
//     });
//   } catch (err) {
//     console.log(err); // Log the error to the console
//     res.status(400).send(err);
//   }
// };

// exports.editUser = async (req, res) => {
//   const { uploadPanCard, bankPassbookphoto, profileImg } = req.files;

//   const userId = req.user.id;
//   const {
//     business,
//     number,
//     name,
//     agency,
//     gstnumber,
//     state,
//     city,
//     address,
//     billduration,
//     billtype,
//     gsttype,
//     number_message,
//     name_message,
//     customised_message,
//     message_type,
//     demo_message,
//     prefix,
//     accountholdername,
//     accountstatus,
//     accountnumber,
//     bankIfsc,
//     Pancardnumber,
//     email,
//   } = req.body;

//   try {
//     const updateUser = {
//       business,
//       number,
//       name,
//       agency,
//       gstnumber,
//       state,
//       city,
//       address,
//       billduration,
//       billtype,
//       gsttype,
//       number_message,
//       name_message,
//       customised_message,
//       message_type,
//       demo_message,
//       prefix,
//       accountholdername,
//       accountstatus,
//       accountnumber,
//       bankIfsc,
//       Pancardnumber,
//       email,
//     };

//     if (uploadPanCard && uploadPanCard[0]) {
//       updateUser.uploadPanCard = uploadPanCard[0].path;
//     }

//     if (bankPassbookphoto && bankPassbookphoto[0]) {
//       updateUser.bankPassbookphoto = bankPassbookphoto[0].path;
//     }

//     if (profileImg && profileImg[0]) {
//       updateUser.profileImg = profileImg[0].path;
//     }

//     const userUpdate = await User.findByIdAndUpdate(userId, updateUser, {
//       new: true,
//     });

//     if (!userUpdate) {
//       return res.status(404).send("User not found");
//     }

//     res.status(200).json({
//       message: "User update successful",
//       user: userUpdate,
//     });
//   } catch (err) {
//     console.log(err); // Log the error to the console
//     res.status(400).send(err);
//   }
// };

exports.editUser = async (req, res) => {
  const { uploadPanCard, bankPassbookphoto, profileImg } = req.files || {};

  const userId = req.user.id;
  const {
    business,
    number,
    name,
    agency,
    gstnumber,
    state,
    city,
    address,
    billduration,
    billtype,
    gsttype,
    number_message,
    name_message,
    customised_message,
    message_type,
    demo_message,
    prefix,
    accountholdername,
    accountstatus,
    accountnumber,
    bankIfsc,
    Pancardnumber,
    email,
  } = req.body;

  try {
    const updateUser = {
      business,
      number,
      name,
      agency,
      gstnumber,
      state,
      city,
      address,
      billduration,
      billtype,
      gsttype,
      number_message,
      name_message,
      customised_message,
      message_type,
      demo_message,
      prefix,
      accountholdername,
      accountstatus,
      accountnumber,
      bankIfsc,
      Pancardnumber,
      email,
    };

    if (uploadPanCard && uploadPanCard[0]) {
      updateUser.uploadPanCard = uploadPanCard[0].path;
    }

    if (bankPassbookphoto && bankPassbookphoto[0]) {
      updateUser.bankPassbookphoto = bankPassbookphoto[0].path;
    }

    if (profileImg && profileImg[0]) {
      updateUser.profileImg = profileImg[0].path;
    }

    const userUpdate = await User.findByIdAndUpdate(userId, updateUser, {
      new: true,
    });

    if (!userUpdate) {
      return res.status(404).send("User not found");
    }

    res.status(200).json({
      message: "User update successful",
      user: userUpdate,
    });
  } catch (err) {
    console.log(err); // Log the error to the console
    res.status(400).send(err);
  }
};

// Get user *****************************************************************
exports.getUserByToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send(user);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

//********************Get user by id****************************************/
exports.getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send(user);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};
//************************************* */
// const Product = require("../models/productSchema");
// const exceljs = require("exceljs");
// const puppeteer = require("puppeteer");
// const fs = require("fs");

// exports.addProduct = async (req, res) => {
//   try {
//     const { name, price, select, gst, product, additional, hsn, genre, type } =
//       req.body;
//     if (!req.user) {
//       return res.json({
//         message: "Unauthorized request",
//       });
//     }
//     const newproduct = new Product({
//       name,
//       price,
//       select,
//       gst,
//       product,
//       additional,
//       hsn,
//       genre,
//       type,
//       userId: req.user.id,
//     });

//     await newproduct.save();
//     res.status(201).json({ message: "Product added successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // get product ******************************************************************
// exports.getProduct = async (req, res) => {
//   try {
//     const id = req.user.id;
//     const products = await Product.find({ userId: id });
//     res.status(200).json(products);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // delete product ********************************************************
// exports.deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findByIdAndDelete(req.params.id);

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.status(200).json({ message: "Product deleted successfully" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // single product **********************************************************
// exports.singleProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     res.status(200).json(product);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.updateProduct = async (req, res) => {
//   const productId = req.params.id;
//   const { name, price, select, gst, product, additional, hsn, genre, type } =
//     req.body;

//   try {
//     const updatedProduct = await Product.findByIdAndUpdate(
//       productId,
//       { name, price, select, gst, product, additional, hsn, genre, type },
//       { new: true }
//     );

//     if (!updatedProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.status(200).json({
//       message: "Product updated successfully",
//       product: updatedProduct,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Download Product *******************************************************
// exports.downloadProduct = async (req, res) => {
//   try {
//     const data = await Product.find();

//     const xls = json2xls(data);
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );
//     res.setHeader("Content-Disposition", "attachment; filename=sample.xlsx");
//     res.send(xls);
//   } catch (error) {
//     console.error("Error downloading data:", error);
//     res.status(500).json({ error: "An error occurred while downloading data" });
//   }
// };

// //*********************************Pdf Download product**********************/
// exports.downloadProductPdf = async (req, res) => {
//   try {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     const product = await Product.find();
//     const name = req.body;

//     console.log(name, "this is product");

//     const htmlContent = `
//   <html>
//     <style>
//       table {
//         width: 100%;
//       }

//       th, td {
//         padding: 8px;
//         text-align: left;
//         border-bottom: 1px solid #ddd;
//       }

//       td {
//         border-left: 1px solid #ddd;
//       }
//     </style>
//     <body>
//       <h1>${name.name}</h1>
//       <h2>Area Wise Product List</h2>
//       <h3>Area Wise Product List</h3>

//       <table style="width:100%">
//   <tr>
//     <th>Product Name</th>
//     <th>Quantity</th>
//   </tr>
//   ${product.map((p) => `<tr><td>${p.name}</td></tr>`).join("")}
// </table>
//     </body>
//   </html>
// `;

//     await page.setContent(htmlContent);
//     const pdfBuffer = await page.pdf({ format: "A4" });
//     await browser.close();

//     // Save the PDF file
//     fs.writeFile("product.pdf", pdfBuffer, () => {
//       // Send the PDF file as a download
//       res.download("product.pdf", "product.pdf", (err) => {
//         if (err) {
//           console.log(err);
//         }
//         // Remove the PDF file after sending the download
//         fs.unlink("product.pdf", (err) => {
//           if (err) {
//             console.log(err);
//           }
//         });
//       });
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("An error occurred");
//   }
// };
