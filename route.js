const express = require('express');
const route = express.Router();
const userModule = require("./module");
const { registervalidation, loginvalidation } = require('./validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const orderModel = require('./orderModel'); 

// Register user
route.post("/register", async (req, res) => {
    const { error } = registervalidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const emailexist = await userModule.findOne({ email: req.body.email });
    if (emailexist) return res.status(400).send("Email already exists");

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new userModule({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        password: hashpassword
    });

    try {
        const savedUser = await newUser.save();
        res.send(savedUser);
    } catch (err) {
        res.status(500).send("Error saving user");
    }
});

// Login user
route.post("/login", async (req, res) => {
    const { error } = loginvalidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const userexits = await userModule.findOne({ email: req.body.email });
    if (!userexits) return res.status(400).send("Invalid email");

    const ispass = await bcrypt.compare(req.body.password, userexits.password);
    if (!ispass) return res.status(400).send("Invalid password");

    const token_secret = "76765rtfhgdcfsdxchgutfytdxyr";
    const token = jwt.sign({ _id: userexits._id }, token_secret);

    res.status(200).json({
        token,
        email: userexits.email,
        name: userexits.name,
        mobile: userexits.mobile
    });
});

// Get user by email

route.get('/login/:email', async (req, res) => {
  try {
    const user = await userModule.findOne({ email: req.params.email });
    if (!user) return res.status(404).send('User not found');
    res.send(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
});


module.exports = route;

// user order detail
route.post('/placeorder', async (req, res) => {
  try {
    const { email, name, mobile, productId, productName, price, image, quantity, address } = req.body;

    const totalPrice = quantity * price;

    const newOrder = new orderModel({
      email,
      name,
      mobile,
      productId,
      productName,
      price,
      image,
      quantity,
      address,
      totalPrice,
      createdAt: new Date()
    });

    const savedOrder = await newOrder.save();
    res.status(200).json({ message: 'Order placed successfully', order: savedOrder });
  } catch (err) {
    res.status(500).json({ error: 'Failed to place order', details: err.message });
  }
});

// ✅ Get Order History by Email
route.get('/placeOrder/:email', async (req, res) => {
  try {
    const email = req.params.email;

    const orders = await orderModel.find({ email });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user." });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


