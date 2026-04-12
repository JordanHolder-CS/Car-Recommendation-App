const express = require("express");
const router = express.Router();

const {
  getCars,
  getSpecs,
  getFilteredCars,
  getRecommendedCars,
} = require("../controllers/carController");

router.get("/specs", getSpecs);
router.get("/filter", getFilteredCars);
router.post("/recommend", getRecommendedCars);
router.get("/", getCars);

module.exports = router;
