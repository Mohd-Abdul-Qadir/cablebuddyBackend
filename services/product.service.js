const Product = require("../models/productSchema");
const exceljs = require("exceljs");
const puppeteer = require("puppeteer");
const fs = require("fs");

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

//*************Download Product in excel  *******************************************************

exports.downloadProductSheet = async (req, res) => {
  try {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("My-Product");

    worksheet.columns = [
      { header: "S no.", key: "s_no" },
      { header: "Name", key: "name" },
      { header: "Rate", key: "price" },
      { header: "GST", key: "gst" },
      { header: "SD or HD", key: "type" },
      { header: "Additional Charge", key: "additional" },
    ];

    let count = 1;
    const productData = await Product.find();
    productData.forEach((product) => {
      product.s_no = count;

      worksheet.addRow(product);
      count++;
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename=product.xlsx`);

    return workbook.xlsx.write(res).then(() => {
      res.status(200);
    });
  } catch (error) {
    console.log(error);
  }
};

//*********************************Pdf Download product**********************/
exports.downloadProductPdf = async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const product = await Product.find();
    const name = req.body;

    console.log(name.name, "this is product");

    const htmlContent = `
  <html>
    <style>
      table {
        width: 100%;
      }

      th, td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }

      td {
        border-left: 1px solid #ddd;
      }
    </style>
    <body>
      <h1>${name.name}</h1>
      <h2>Area Wise Product List</h2>
      <h3>Area Wise Product List</h3>

      <table style="width:100%">
  <tr>
    <th>Product Name</th>
    <th>Quantity</th>
  </tr>
  ${product.map((p) => `<tr><td>${p.name}</td></tr>`).join("")}
</table>
    </body>
  </html>
`;

    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    // Save the PDF file
    fs.writeFile("product.pdf", pdfBuffer, () => {
      // Send the PDF file as a download
      res.download("product.pdf", "product.pdf", (err) => {
        if (err) {
          console.log(err);
        }
        // Remove the PDF file after sending the download
        fs.unlink("product.pdf", (err) => {
          if (err) {
            console.log(err);
          }
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred");
  }
};
