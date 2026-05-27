const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productId: {
    type: String,
    unique: true,
    default: () => "#" + Math.floor(100000 + Math.random() * 900000)
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ["Smart Phones", "Fashion", "Interior Design", "Laptops"]
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  color: {
    type: String,
    required: true,
    trim: true
  },
  dateAdded: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);