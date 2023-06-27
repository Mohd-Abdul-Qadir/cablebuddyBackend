const Expenses = require("../models/expensesSchema");
const exceljs = require("exceljs");
const puppeteer = require("puppeteer");
const fs = require("fs");

exports.addExpenses = async (req, res) => {
  try {
    const { amount, category, commit, date } = req.body;
    if (!req.user) {
      return res.json({
        message: "Unauthorized request",
      });
    }
    const newexpenses = new Expenses({
      amount,
      category,
      commit,
      date,
    });

    await newexpenses.save();
    res.status(201).json({ message: "Expenses added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// get Expenses ******************************************************************
exports.getExpenses = async (req, res) => {
  try {
    // const id = req.user.id;
    const expenses = await Expenses.find();
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
