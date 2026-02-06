const express = require("express");
const router = express.Router();
const { getAllCars, getCarByType } = require("../controllers/carController");

router.get("/type/:type", getCarByType);
router.get("/", getAllCars);

module.exports = router;
