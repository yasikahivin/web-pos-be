const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/webpos", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Define your routes
app.use("/api/clients", require("./routes/clients"));
app.use("/api/products", require("./routes/products"));
app.use("/api/invoices", require("./routes/invoices"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
