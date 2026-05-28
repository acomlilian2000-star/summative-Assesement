const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

router.get("/dashboard", async (req, res) => {
  try {
    const products = await Product.find().sort({ dateAdded: -1 });

    let totalSalesSimulation = 50000000;
    let totalOrdersSimulation = 15000000;
    let totalInStockValue = 0;
    let outOfStockCount = 0;

    products.forEach((product) => {
      if (product.quantity > 0) {
        totalInStockValue += product.price * product.quantity;
      } else {
        outOfStockCount++;
      }
    });

    res.render("dashboard", {
      products: products,
      sales: totalSalesSimulation,
      orders: totalOrdersSimulation,
      inStockValue: totalInStockValue,
      outOfStock: outOfStockCount,

      success_msg: req.flash("success"),
      error_msg: req.flash("error"),
    });
  } catch (error) {
    console.error("Dashboard Loading Error:", error);
    res.status(500).send("Error reading inventory data records.");
  }
});

router.post("/dashboard", async (req, res) => {
  try {
    const { productName, category, price, quantity, color } = req.body;

    const newProduct = new Product({
      productName,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      color,
    });

    await newProduct.save();

    // Adds flash message on successful database save
    req.flash("success", "Product has been added successfully !");

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Save Product Error:", error);

    // adds a flash message instead of flat crash
    req.flash("error", "Failed to save product. Please check your inputs.");
    res.redirect("/dashboard");
  }
});

module.exports = router;
