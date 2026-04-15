const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const carRoutes = require("../routes/carRoute.js");
const dealerRoutes = require("../routes/dealerRoute.js");
const bookingRoutes = require("../routes/bookingRoute.js");
const URL = process.env.HTTPS_URL;

app.use(express.json());
app.use("/api/car", carRoutes);
app.use("/api/dealers", dealerRoutes);
app.use("/api/bookings", bookingRoutes);

app.listen(port, () => {
  console.log(`App listening at ${URL}`);
});
