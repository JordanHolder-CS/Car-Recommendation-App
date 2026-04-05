const dealerModel = require("../models/dealerModel");

const getDealers = async (req, res) => {
  try {
    const hasFilters = Object.keys(req.query || {}).length > 0;
    const dealers = hasFilters
      ? await dealerModel.findFiltered(req.query)
      : await dealerModel.findAll();

    res.status(200).json(dealers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving dealers", error: error.message });
  }
};

const getFilteredDealers = async (req, res) => {
  try {
    const dealers = await dealerModel.findFiltered(req.query);
    res.status(200).json(dealers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering dealers", error: error.message });
  }
};

const getDealerById = async (req, res) => {
  try {
    const dealerId = Number.parseInt(req.params.dealerId, 10);

    if (!Number.isFinite(dealerId)) {
      return res.status(400).json({ message: "Invalid dealer id" });
    }

    const dealer = await dealerModel.findById(dealerId);

    if (!dealer) {
      return res.status(404).json({ message: "Dealer not found" });
    }

    res.status(200).json(dealer);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving dealer", error: error.message });
  }
};

module.exports = {
  getDealers,
  getFilteredDealers,
  getDealerById,
};
