const express = require("express");
const router = express.Router();

const {
  getDealers,
  getDealerById,
  getDealerListings,
} = require("../controllers/dealersController");

router.get("/:dealerId/listings", getDealerListings);
router.get("/:dealerId", getDealerById);
router.get("/", getDealers);

module.exports = router;
