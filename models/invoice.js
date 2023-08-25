const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  number: String,
  amount: Number,
  items: [
    {
      name: String,
      price: Number,
    },
  ],
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
  },
  issue_date: Date,
  due_date: Date,
});

module.exports = mongoose.model("Invoice", invoiceSchema);
