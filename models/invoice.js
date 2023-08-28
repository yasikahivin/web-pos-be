const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  amount: Number,
  date: Date,
});

const invoiceSchema = new mongoose.Schema({
  inv_date: {
    type: Date,
  },
  due_date: {
    type: Date,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
  },
  invoiceItems: [
    {
      name: String,
      price: Number,
      quantity: Number,
      // product: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: "product",
      // },
    },
  ],
  subTotal: {
    type: Number,
    default: 0.0,
  },
  payments: [paymentSchema], // Array of payment objects
  ispaid: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
