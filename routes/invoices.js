const express = require("express");
const router = express.Router();
const Invoice = require("../models/invoice");
const Client = require("../models/client"); // Import the Client model

// GET all invoices
router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find().populate("client"); // Populate the 'client' field
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a new invoice
router.post("/", async (req, res) => {
  const invoice = new Invoice({
    number: req.body.number,
    amount: req.body.amount,
    items: req.body.items,
    client: req.body.clientId,
    issue_date: req.body.date,
    due_date: req.body.date, // Assuming the client ID is sent in the request body
  });

  try {
    // Check if the client ID exists
    const clientExists = await Client.exists({ _id: req.body.clientId });
    if (!clientExists) {
      return res.status(400).json({ message: "Client not found" });
    }

    const newInvoice = await invoice.save();
    res.status(201).json(newInvoice);
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
