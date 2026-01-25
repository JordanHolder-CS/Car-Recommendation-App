const carModel = require("../models/carModel");

const getCar = async (req, res) => {
  try {
    const cars = await carModel.findAll();
    res.status(200).json(cars);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving users", error: error.message });
  }
};

module.exports = { getCar };
