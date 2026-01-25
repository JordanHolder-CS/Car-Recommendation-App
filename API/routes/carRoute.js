const express = require("express");
const router = express.Router();
const { getCar } = require("../controllers/carController");

router.get("/", getCar);

module.exports = router;
