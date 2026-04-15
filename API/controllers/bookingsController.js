const bookingModel = require("../models/bookingModel");

const toOptionalString = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
};

const createBooking = async (req, res) => {
  try {
    const payload = req.body || {};
    const fullName = toOptionalString(payload.fullName);
    const email = toOptionalString(payload.email);
    const phone = toOptionalString(payload.phone);

    if (!fullName || !email || !phone) {
      return res.status(400).json({
        message: "fullName, email, and phone are required",
      });
    }

    const result = await bookingModel.create({
      ...payload,
      fullName,
      email,
      phone,
    });

    return res.status(201).json({
      message: "Booking created",
      booking: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating booking",
      error: error.message,
    });
  }
};

module.exports = {
  createBooking,
};
