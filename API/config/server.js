require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const carRoutes = require("../routes/carRoute.js");
const URL = process.env.HTTPS_URL;

app.use(express.json());
app.use("/api/car", carRoutes);

app.listen(port, () => {
  console.log(`App listening at ${URL}`);
});
