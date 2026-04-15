const pool = require("../config/pool");

const INSERT_BOOKING_QUERY = `
  INSERT INTO "Car Data".booking_info (
    name,
    email,
    phone_no,
    "time",
    date
  )
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *
`;

const bookingModel = {
  create: async (payload = {}) => {
    const values = [
      payload.fullName ?? null,
      payload.email ?? null,
      payload.phone ?? null,
      payload.selectedTime ?? null,
      payload.selectedDate ?? null,
    ];

    const result = await pool.query(INSERT_BOOKING_QUERY, values);
    return result.rows[0] || null;
  },
};

module.exports = bookingModel;
