const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const Product = require("../models/productSchema");
const Customer = require("../models/customerSchema");
const config = require("../config/config");
const router = express.Router();

// for parsing application/json
require("../config/db");

router.post("/register", async (req, res) => {
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
  });

  try {
    // Save the user to the database
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Edit api

router.put("/users/:id", async (req, res) => {
  const userId = req.params.id;

  // Find the user by ID
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).send("User not found");
  }

  // Update the user's data
  user.roll = req.body.roll || user.roll;
  user.business = req.body.business || user.business;
  user.number = req.body.number || user.number;
  user.name = req.body.name || user.name;
  user.agency = req.body.agency || user.agency;
  user.gstnumber = req.body.gstnumber || user.gstnumber;
  user.state = req.body.state || user.state;
  user.city = req.body.city || user.city;
  user.address = req.body.address || user.address;
  user.billduration = req.body.billduration || user.billduration;
  user.billtype = req.body.billtype || user.billtype;
  user.gsttype = req.body.gsttype || user.gsttype;
  user.number_message = req.body.number_message || user.number_message;
  user.name_message = req.body.name_message || user.name_message;
  user.customised_message =
    req.body.customised_message || user.customised_message;
  user.message_type = req.body.message_type || user.message_type;
  user.demo_message = req.body.demo_message || user.demo_message;
  user.prefix = req.body.prefix || user.prefix;
  user.accountholdername = req.body.accountholdername || user.accountholdername;
  user.accountstatus = req.body.accountstatus || user.accountstatus;
  user.accountnumber = req.body.accountnumber || user.accountnumber;
  user.bankIfsc = req.body.bankIfsc || user.bankIfsc;
  user.Pancardnumber = req.body.Pancardnumber || user.Pancardnumber;
  user.email = req.body.email || user.email;
  user.uploadPanCard = req.body.uploadPanCard || user.uploadPanCard;
  user.bankPassbookphoto = req.body.bankPassbookphoto || user.bankPassbookphoto;

  try {
    // Save the updated user data to the database
    const updatedUser = await user.save();
    res.send(updatedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

// router.post("/register", async (req, res) => {
//   try {
//     const { roll, number, password } = req.body;

//     const userExist = await User.findOne({ number: number });
//     if (userExist) {
//       return res
//         .status(422)
//         .json({ error: "number already Exist", isSuccess: false });
//     }

//     const user = new User({ roll, number, password });
//     await user.save();
//     return res
//       .status(201)
//       .json({ message: "user registerd succesfuly", isSuccess: true });
//   } catch (err) {
//     console.log("could not register" + err);
//   }
// });
// router.post("/login", async (req, res) => {
//   const { number, password } = req.body;

//   try {
//     // Check if the user exists
//     const user = await User.findOne({ number: number });
//     if (!user) {
//       return res.status(404).send("User not found");
//     }

//     // Compare the provided password with the stored password hash
//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch) {
//       return res.status(401).send("Invalid password");
//     }

//     // If the password is correct, create a JWT and send it as a response
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
//     res.send({
//       message: "Login successful",
//       token: token,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(400).send(err);
//   }
// });

router.post("/login", async (req, res) => {
  try {
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
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, config.secret, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.json({ message: "Login successful", token });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/add-product", async (req, res) => {
  const { name, price, select, gst, product, additional, hsn, genre, type } =
    req.body;

  try {
    const newproduct = new Product({
      name,
      price,
      select,
      gst,
      product,
      additional,
      hsn,
      genre,
      type,
    });

    await newproduct.save(); // save the new product to the database
    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find(); // retrieve all products from the database
    res.status(200).json(products); // send the retrieved products as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/single-products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // retrieve product by ID
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product); // send the retrieved product as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find(); // retrieve all products from the database
    res.status(200).json(products); // send the retrieved products as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/update-product/:id", async (req, res) => {
  const productId = req.params.id;
  const { name, price, select, gst, product, additional, hsn, genre, type } =
    req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, price, select, gst, product, additional, hsn, genre, type },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/add-customer", async (req, res) => {
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
  } = req.body;

  try {
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
    });

    await newCustomer.save(); // save the new product to the database
    res.status(201).json({ message: "Customer added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/customers", async (req, res) => {
  try {
    const customers = await Customer.find(); // retrieve all products from the database
    res.status(200).json(customers); // send the retrieved products as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
