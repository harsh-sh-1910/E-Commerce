const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const connection = require("./config/connection");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config("./.env");
const path = require("path");

const corsOption = require("./config/corsOption");
const app = express();
app.use(cors(corsOption));
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "uploads")));
app.use("/category", require("./routes/categoryRoutes"));
app.use("/address", require("./routes/addressRoutes"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/product", require("./routes/productRoutes"));
app.use("/order", require("./routes/orderRoutes"));
app.use("/review", require("./routes/reviewRoutes"));
app.use("/deal", require("./routes/dealRoutes"));
app.use("/payment", require("./routes/paymentRoutes"));
// ===== Shiprocket Token Setup =====

app.listen(5000, () => {
  console.log("SERVER IS RUNNING AT PORT 5000");
});
