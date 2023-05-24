const Product = require("../models/productSchema");
const exceljs = require("exceljs");

exports.addProduct = async (req, res) => {
  try {
    const { name, price, select, gst, product, additional, hsn, genre, type } =
      req.body;
    if (!req.user) {
      return res.json({
        message: "Unauthorized request",
      });
    }
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
      userId: req.user.id,
    });

    await newproduct.save();
    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// get product ******************************************************************
exports.getProduct = async (req, res) => {
  try {
    const id = req.user.id;
    const products = await Product.find({ userId: id });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// delete product ********************************************************
exports.deleteProduct = async (req, res) => {
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
};

// single product **********************************************************
exports.singleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProduct = async (req, res) => {
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
};

// Download Product *******************************************************
exports.downloadProduct = async (req, res) => {
  try {
    const data = await Product.find();

    const xls = json2xls(data);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=sample.xlsx");
    res.send(xls);
  } catch (error) {
    console.error("Error downloading data:", error);
    res.status(500).json({ error: "An error occurred while downloading data" });
  }
};
