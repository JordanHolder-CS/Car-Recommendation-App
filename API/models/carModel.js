const pool = require("../config/pool");

const carModel = {
  findAll: async () => {
    const result = await pool.query('SELECT * FROM "Car Data".car');
    return result.rows;
  },
};

module.exports = carModel;
