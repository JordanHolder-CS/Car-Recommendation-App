const express = require("express");
const router = express.Router();

const {
  getCars,
  getCarByType,
  getSpecs,
  getFilteredCars,
} = require("../controllers/carController");

router.get("/type/:type", getCarByType);
router.get("/specs", getSpecs);
router.get("/filter", getFilteredCars);
router.get("/", getCars);

module.exports = router;
