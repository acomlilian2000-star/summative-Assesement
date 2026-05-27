const express = require('express');
const router = express.Router();

// CORRECTED: Imported as 'Product' to match your database query calls below
const Product = require('../models/Product'); 

// GET: Fetch products and calculate operational metrics dynamically
router.get('/dashboard', async (req, res) => {
    try {
        // Pull all records from MongoDB sorted by newest arrivals first
        const products = await Product.find().sort({ dateAdded: -1 });

        // Calculate metrics dynamically based on live database data
        let totalSalesSimulation = 50000000; // Placeholder static metrics value
        let totalOrdersSimulation = 15000000; // Placeholder static metrics value
        let totalInStockValue = 0;
        let outOfStockCount = 0;

        products.forEach(product => {
            if (product.quantity > 0) {
                totalInStockValue += (product.price * product.quantity);
            } else {
                outOfStockCount++;
            }
        });

        // Pass database list along with calculated aggregates directly into the view layer
        // Express passes req.flash messages automatically if configured via res.locals in app.js
        res.render('dashboard', {
            products: products,
            sales: totalSalesSimulation,
            orders: totalOrdersSimulation,
            inStockValue: totalInStockValue,
            outOfStock: outOfStockCount,
            // Fallback explicit passing if res.locals is not active in app.js:
            success_msg: req.flash('success'),
            error_msg: req.flash('error')
        });
    } catch (error) {
        console.error("Dashboard Loading Error:", error);
        res.status(500).send("Error reading inventory data records.");
    }
});

// POST: Add new product data validation row to collection
router.post('/dashboard', async (req, res) => {
    try {
        const { productName, category, price, quantity, color } = req.body;

        // CORRECTED: Explicitly matches the variable identifier 'Product' declared at the top
        const newProduct = new Product({
            productName,
            category,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            color
        });

        await newProduct.save();
        
        // ✅ CORRECTED: Added flash message on successful database save
        req.flash('success', 'Product has been added successfully !');
        
        // Refresh back to dashboard screen to render updated inventory list item collections
        res.redirect('/dashboard');
    } catch (error) {
        console.error("Save Product Error:", error);
        
        // ✅ CORRECTED: Added flash message on database failure instead of crashing with a flat .send() string
        req.flash('error', 'Failed to save product. Please check your inputs.');
        res.redirect('/dashboard');
    }
});

module.exports = router;