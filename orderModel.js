const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  email: String,
  name: String,
  mobile: String,
  productId: String,
  productName: String,
  price: Number,
  image: String,
  quantity: Number,
  address: String,
  totalPrice: Number,
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('order', orderSchema);


