const express = require("express");
const router = express.Router();
const Client = require("../models/client");

// GET all clients
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new client
router.post("/", async (req, res) => {
  const client = new Client({
    name: req.body.name,
    email: req.body.email,
    credit_limit: req.body.credit_limit,
  });

  try {
    const newClient = await client.save();
    res.status(201).json(newClient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET a specific client by ID
router.get("/:id", getClient, (req, res) => {
  res.json(res.client);
});

// Middleware to get a client by ID
async function getClient(req, res, next) {
  try {
    const client = await Client.findById(req.params.id);
    if (client == null) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.client = client;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// PUT (update) a client
router.put("/:id", getClient, async (req, res) => {
  if (req.body.name != null) {
    res.client.name = req.body.name;
  }
  if (req.body.email != null) {
    res.client.email = req.body.email;
  }
  if (req.body.credit_limit != null) {
    res.client.credit_limit = req.body.credit_limit;
  }
  try {
    const updatedClient = await res.client.save();
    res.json(updatedClient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a client
router.delete("/:id", getClient, async (req, res) => {
  try {
    await Client.deleteOne({ _id: res.client._id });

    res.json({ message: "Client deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
