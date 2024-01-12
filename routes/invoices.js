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
    payments,
    isPaid,
  } = req.body;

  try {
    // Check if the client ID exists
    const clientExists = await Client.exists({ _id: clientId });
    if (!clientExists) {
      return res.status(400).json({ message: "Client not found" });
    }

    const subTotal = invoiceItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

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
    const { inv_date, due_date, invoiceItems, payments, isPaid } = req.body;

    // Update invoice fields
    res.invoice.inv_date = inv_date;
    res.invoice.due_date = due_date;
    res.invoice.invoiceItems = invoiceItems;

    // Update payments and check if invoice is paid
    res.invoice.payments = payments;
    res.invoice.ispaid = isPaid || calculateIsPaid(res.invoice);

    // Recalculate subTotal based on updated invoice items
    res.invoice.subTotal = invoiceItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const updatedInvoice = await res.invoice.save();
    res.json(updatedInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update an existing invoice with a new payment
router.put("/:id/add-payment", getInvoice, async (req, res) => {
  try {
    const { amount, date } = req.body;

    // Add the new payment to the payments array
    res.invoice.payments.push({ amount, date });

    // Update the ispaid flag based on payments
    res.invoice.ispaid = calculateIsPaid(res.invoice);

    // Save the updated invoice
    const updatedInvoice = await res.invoice.save();
    res.json(updatedInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Calculate if the invoice is fully paid based on payments
function calculateIsPaid(invoice) {
  const totalPaid = invoice.payments.reduce(
    (total, payment) => total + payment.amount,
    0
  );
  return totalPaid >= invoice.subTotal;
}

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
