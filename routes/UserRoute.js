const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const Product = require("../models/productSchema");
const Customer = require("../models/customerSchema");
const Agent = require("../models/agentSchema");
const config = require("../config/config");
const router = express.Router();
const fs = require("fs");
const csv = require("fast-csv");
const multer = require("multer");
const json2xls = require('json2xls');
 const exceljs =require('exceljs')
// for parsing application/json
require("../config/db");
const auth = require("../middlware/auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".csv");
  },
});
const upload = multer({ storage: storage });



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

router.post("/login", async (req, res) => {
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
});

router.post("/add-product", async (req, res) => {
  const { name, price, select, gst, product, additional, hsn, genre, type } =
    req.body;
  // const { authorization } = req.headers;
  // const user = jwt.verify(authorization, config.secret);
  // console.log(user, "USER");
  // if (!user) {
  //   return res.json({
  //     message: "Unauthorized request",
  //   });
  // }
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
      // userId: user.id,
    });

    await newproduct.save(); // save the new product to the database
    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/delete-products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/products", async (req, res) => {
  try {
    // const id = req.user.id; 
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

// router.get("/products", async (req, res) => {
//   try {
//     console.log(req.user,"user ")
//     const products = await Product.find(); // retrieve all products from the database
//     res.status(200).json(products); // send the retrieved products as JSON response
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

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

  // const { authorization } = req.headers;
  // const user = jwt.verify(authorization, config.secret);
  // console.log(user, "USER");
  // if (!user) {
  //   return res.json({
  //     message: "Unauthorized request",
  //   });
  // }

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
      // userId: user.id,
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
    // const id = req.user.id;
    const customers = await Customer.find(); // retrieve all products from the database
    res.status(200).json(customers); // send the retrieved products as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/add-agent", async (req, res) => {
  const { name, number, password } = req.body;

  try {
    const newagent = new Agent({
      name,
      number,
      password,
    });

    await newagent.save(); // save the new product to the database
    res.status(201).json({ message: "agent added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/agents", async (req, res) => {
  try {
    const agents = await Agent.find(); // retrieve all products from the database
    res.status(200).json(agents); // send the retrieved products as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/single-agents/:id", async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id); // retrieve product by ID
    if (!agent) {
      return res.status(404).json({ message: "agent not found" });
    }
    res.status(200).json(agent); // send the retrieved product as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/update-agent/:id", async (req, res) => {
  const agentId = req.params.id;
  const { name, number} = req.body;

  try {
    const updatedAgent = await Agent.findByIdAndUpdate(
      agentId,
      { name, number},
      { new: true }
    );

    if (!updatedAgent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.status(200).json({
      message: "Agent updated successfully",
      agent: updatedAgent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/total-agents", async (req, res) => {
  try {
    const totalAgents = await Agent.countDocuments();
    res.json({ totalAgents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("import", upload.single("file"), (req, res) => {
  const stream = csv.parseFile(req.file.path, { headers: true });

  const results = [];

  stream.on("data", function (row) {
    results.push(row);
  });

  stream.on("end", function () {
    res.json({ success: true, data: results });
  });

  stream.on("error", function (err) {
    console.error(err);
    res.json({ success: false, message: "Error importing CSV file" });
  });
});


router.get('/download', async (req, res) => {
  try {
    // Retrieve data from MongoDB
    const data = await Product.find(); // Modify the query according to your needs

    // Convert data to Excel format
    const xls = json2xls(data);

    // Set response headers for Excel file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=sample.xlsx');

    // Send the Excel file as the response
    res.send(xls);
  } catch (error) {
    console.error('Error downloading data:', error);
    res.status(500).json({ error: 'An error occurred while downloading data' });
  }
});

router.get('/agent-download',async(req,res)=>{
  try {

    const workbook = new exceljs.Workbook();
    const worksheet =workbook.addWorksheet("My-Product")

    worksheet.columns =[
      { header:"S no.", key:"s_no"},
      { header:"Name", key:"name"},
      { header:"Product Code", key:"product"},
      { header:"Price", key:"price"},
      { header:"Gst", key:"gst"},
    ]

    let count =2012;
    const productData = await Product.find()
    productData.forEach((product)=>{
      product.s_no= count

      worksheet.addRow(product)
      count ++;
    })

   res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
   );
   res.setHeader("Content-Disposition",`attachment; filename=product.xlsx`);

   return workbook.xlsx.write(res).then(()=>{
    res.status(200)
   })
    
  } catch (error) {
    console.log(error)
    
  }
})

module.exports = router;
