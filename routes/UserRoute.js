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
  const { roll, business, number, password } = req.body;

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
  });

  try {
    // Save the user to the database
    const savedUser = await user.save();
    res.send(savedUser);
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

router.put("/update-product/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      {
        new: true,
      }
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
    billing,
    area,
    no,
    product,
    number1,
    number2,
    email,
    deposit,
    address,
    gst,
    code,
    remark,
    stbName,
    stbNumber,
    cardNumber,
    membership,
    startDate,
    balance,
    AdditionalCharg,
    billDuration,
    billType,
    gstType,
  } = req.body;

  try {
    const newCustomer = new Customer({
      name,
      billing,
      area,
      no,
      product,
      number1,
      number2,
      email,
      deposit,
      address,
      gst,
      code,
      remark,
      stbName,
      stbNumber,
      cardNumber,
      membership,
      startDate,
      balance,
      AdditionalCharg,
      billDuration,
      billType,
      gstType,
    });

    await newCustomer.save(); // save the new product to the database
    res.status(201).json({ message: "Customer added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
