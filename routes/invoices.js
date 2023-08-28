const express = require("express");
const router = express.Router();
const Invoice = require("../models/invoice");
const Client = require("../models/client");

// GET all invoices
router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find().populate("client");
    //.populate("invoiceItems.product"); // Populate the 'client' and 'product' references
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a new invoice
router.post("/", async (req, res) => {
  const {
    inv_date,
    due_date,
    client: clientId,
    invoiceItems,
    subTotal,
    payments,
    isPaid,
  } = req.body;

  try {
    // Check if the client ID exists
    const clientExists = await Client.exists({ _id: clientId });
    if (!clientExists) {
      return res.status(400).json({ message: "Client not found" });
    }

    const invoice = new Invoice({
      inv_date,
      due_date,
      client: clientId,
      invoiceItems,
      subTotal,
      payments,
      isPaid,
    });

    const newInvoice = await invoice.save();
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update an existing invoice
router.put("/:id", getInvoice, async (req, res) => {
  try {
    const { inv_date, due_date, invoiceItems, subTotal, payments, isPaid } =
      req.body;

    // Update invoice fields
    res.invoice.inv_date = inv_date;
    res.invoice.due_date = due_date;

    // Update invoice items and recalculate subTotal
    res.invoice.invoiceItems = invoiceItems;
    res.invoice.subTotal = subTotal;
    res.invoice.payments = payments;
    res.invoice.isPaid = isPaid;

    const updatedInvoice = await res.invoice.save();
    res.json(updatedInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE an invoice
router.delete("/:id", getInvoice, async (req, res) => {
  try {
    await res.invoice.remove();
    res.json({ message: "Invoice deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware to get an invoice by ID
async function getInvoice(req, res, next) {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (invoice == null) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.invoice = invoice;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = router;
