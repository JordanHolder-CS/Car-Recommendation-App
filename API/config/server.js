const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const express = require("express");

[
  path.resolve(__dirname, ".env"),
  path.resolve(__dirname, "../.env"),
  path.resolve(__dirname, "../../.env"),
].forEach((envFile) => {
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
  }
});

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
