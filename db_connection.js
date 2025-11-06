const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const env = require('dotenv');
env.config();

app.use(cors());
app.use(express.json());

// Import and use your user route
const userRoute = require('./route');
app.use('/user', userRoute);

mongoose.connect(process.env.Db_collection)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
