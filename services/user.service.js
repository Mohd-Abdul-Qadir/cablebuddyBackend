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
  // req.user = {
  //   id: user.id,
  //   name: user.name,
  //   email: user.email,
  // };
  const file = req.file;
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
    uploadPanCard,
    bankPassbookphoto,
  } = req.body;

  try {
    const userUpdate = await User.findByIdAndUpdate(
      userId,
      {
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
        uploadPanCard,
        bankPassbookphoto,
      },
      { new: true }
    );

    if (!userUpdate) {
      return res.status(404).send("User not found");
    }
    res.status(200).json({
      message: "user Update successfull",
      user: userUpdate,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

// Get user *****************************************************************
exports.getUserByToken = async (req, res) => {
  // const { number } = req.params;
  // const { accessToken } = req.headers;

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
