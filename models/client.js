const mongoose = require("mongoose");

//Schema mapping MongoDb collection keys with Types in JS 

const clientSchema = new mongoose.Schema({
  name: String,
  email: String,
});

module.exports = mongoose.model("Client", clientSchema);
