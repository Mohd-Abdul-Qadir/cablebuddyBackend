const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const config = require("../config/config");
require("../config/db");

// register api **************************************
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

// Edit api *****************************************************************************
exports.editUser = async (req, res) => {
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
};
