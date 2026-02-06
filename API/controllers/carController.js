const carModel = require("../models/carModel");

const getAllCars = async (req, res) => {
  try {
    const cars = await carModel.findAll();
    res.status(200).json(cars);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving cars", error: error.message });
  }
};

const getCarByType = async (req, res) => {
  try {
    const { type } = req.params;
    const cars = await carModel.findByType(type);
    res.status(200).json(cars);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving cars", error: error.message });
  }
};

module.exports = { getAllCars, getCarByType };
