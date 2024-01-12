const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose"); //An Object Data mapper for connect MongoDB to JavaScript

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

/*
  // No longer necessary after mongoose 6:

  mongoose.set('useFindAndModify', false);

  await mongoose.connect('mongodb://127.0.0.1:27017/test', {
    useNewUrlParser: true, // <-- no longer necessary
    useUnifiedTopology: true // <-- no longer necessary
  });

  Mongoose 6 always behaves as if useNewUrlParser, useUnifiedTopology, and useCreateIndex are true

*/

// Define routes
app.use("/api/clients", require("./routes/clients"));
app.use("/api/products", require("./routes/products"));
app.use("/api/invoices", require("./routes/invoices"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
