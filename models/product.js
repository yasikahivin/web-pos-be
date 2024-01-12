const mongoose = require("mongoose");

//Schema mapping MongoDb collection keys with Types in JS 

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
});

module.exports = mongoose.model("Product", productSchema);
