const pool = require("../config/pool");

const BOOKING_TABLE = `"Car Data".booking`;

const INSERT_BOOKING_QUERY = `
  INSERT INTO ${BOOKING_TABLE} (
    full_name,
    email,
    phone,
    selected_date,
    selected_time,
    owner_user_id,
    vehicle_name,
    dealer_name,
    dealer_address,
    dealer_id,
    car_id,
    dealerinventory_id,
    status
  )
  VALUES (
    $1, $2, $3, $4, $5, $6, $7,
    $8, $9, $10, $11, $12, $13
  )
  RETURNING *
`;

const bookingModel = {
  create: async (payload = {}) => {
    const values = [
      payload.fullName ?? null,
      payload.email ?? null,
      payload.phone ?? null,
      payload.selectedDate ?? null,
      payload.selectedTime ?? null,
      payload.ownerUserId ?? null,
      payload.vehicleName ?? null,
      payload.dealerName ?? null,
      payload.dealerAddress ?? null,
      payload.dealerId ?? null,
      payload.carId ?? null,
      payload.dealerInventoryId ?? null,
      "pending",
    ];

    const result = await pool.query(INSERT_BOOKING_QUERY, values);
    return result.rows[0] || null;
  },
};

module.exports = bookingModel;
