require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();
const port = 8080;
const carRoutes = require("../routes/carRoute.js");

app.use(express.json());
app.use("/api/car", carRoutes);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}/api/car`);
});
