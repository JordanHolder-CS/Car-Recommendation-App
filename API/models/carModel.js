const pool = require("../config/pool");

const carModel = {
  findAll: async () => {
    const result = await pool.query('SELECT * FROM "Car Data".car');
    return result.rows;
  },

  findByType: async (type) => {
    const result = await pool.query(
      'SELECT * FROM "Car Data".car WHERE LOWER(type) = LOWER($1)',
      [type],
    );
    return result.rows;
  },
};

module.exports = carModel;
