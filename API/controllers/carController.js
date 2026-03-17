const carModel = require("../models/carModel");

const getCars = async (req, res) => {
  try {
    const cars = await carModel.findAll();
    res.status(200).json(cars);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving cars", error: error.message });
  }
};

const getFilteredCars = async (req, res) => {
  try {
    const filters = req.query;
    const cars = await carModel.findFiltered(filters);
    res.status(200).json(cars);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering cars", error: error.message });
  }
};
const getSpecs = async (req, res) => {
  try {
    const specs = await carModel.findSpecs(req.query);
    res.status(200).json(specs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving specs", error: error.message });
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

module.exports = { getCars, getCarByType, getSpecs, getFilteredCars };
