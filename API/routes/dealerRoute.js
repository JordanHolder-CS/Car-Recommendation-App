const express = require("express");
const router = express.Router();

const {
  getDealers,
  getFilteredDealers,
  getDealerById,
} = require("../controllers/dealersController");

router.get("/filter", getFilteredDealers);
router.get("/:dealerId", getDealerById);
router.get("/", getDealers);

module.exports = router;
