const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: String,
  email: String,
  credit_limit: Number
});

module.exports = mongoose.model('Client', clientSchema);
