const express = require("express");
const router = express.Router();

const {
  getCars,
  getCarByType,
  getSpecs,
  getFilteredCars,
  getRecommendedCars,
} = require("../controllers/carController");

router.get("/type/:type", getCarByType);
router.get("/specs", getSpecs);
router.get("/filter", getFilteredCars);
router.get("/recommend", getRecommendedCars);
router.post("/recommend", getRecommendedCars);
router.get("/", getCars);

module.exports = router;
