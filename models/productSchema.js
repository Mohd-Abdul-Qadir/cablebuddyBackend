const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  select: {
    type: String,
    required: true,
  },
  gst: {
    type: String,
  },
  product: {
    type: String,
  },
  additional: {
    type: String,
  },
  hsn: {
    type: String,
  },
  genre: {
    type: String,
  },
  type: {
    type: String,
  },
  language: {
    type: String,
  },
  userId: {
    type: String,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
