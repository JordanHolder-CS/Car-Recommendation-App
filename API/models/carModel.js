const pool = require("../config/pool");

const carModel = {
  findAll: async () => {
    const result = await pool.query(
      `SELECT c.car_id, c.name as car_name, b.name as brand_name
       FROM "Car Data".car c
       JOIN "Car Data".brands b ON b.brand_id = c.brand_id`,
    );
    return result.rows;
  },

  findSpecs: async () => {
    const result = await pool.query(
      'SELECT c.car_id, c.name, s.* FROM "Car Data".car c  JOIN "Car Data".car_specs s ON s.car_id = c.car_id WHERE s.horsepower IS NOT NULL',
    );
    return result.rows;
  },

  findFiltered: async (filters = {}) => {
    const conditions = [];
    const values = [];
    const carFields = {
      type: "string",
    };
    const specFields = {
      zero_to_sixty_mph: "number",
      horsepower: "string",
      seat_count: "number",
      boot_space_liters: "number",
      body_style: "string",
      service_cost: "number",
      insurance_estimate: "number",
      reliability: "string",
      price: "number",
      curb_weight: "number",
      top_speed: "number",
      torque: "number",
      combined_mpg: "number",
      ev_range: "number",
      epa_city: "number",
      epa_mpg_hwy: "number",
      epa_combined: "number",
      estimated_electric_range: "number",
      charge_time: "number",
      drivetrain: "string",
      max_seating_capacity: "number",
      is_ev: "boolean",
      battery_capacity: "number",
      towing_capacity: "number",
      cargo_capacity: "number",
      model_year: "number",
      standard_engine: "string",
    };

    const parseBoolean = (value) => {
      if (typeof value === "boolean") {
        return value;
      }
      if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();
        if (normalized === "true" || normalized === "1") {
          return true;
        }
        if (normalized === "false" || normalized === "0") {
          return false;
        }
      }
      return undefined;
    };

    Object.entries(filters).forEach(([key, rawValue]) => {
      if (rawValue === undefined || rawValue === null || rawValue === "") {
        return;
      }

      const isMin = key.startsWith("min_");
      const isMax = key.startsWith("max_");
      const baseKey = isMin || isMax ? key.slice(4) : key;
      const specType = specFields[baseKey];
      const carType = carFields[baseKey];

      if ((isMin || isMax) && specType === "number") {
        const parsedValue = Number.parseFloat(rawValue);
        if (Number.isFinite(parsedValue)) {
          values.push(parsedValue);
          conditions.push(
            `specs.${baseKey} ${isMin ? ">=" : "<="} $${values.length}`,
          );
        }
        return;
      }

      if (specType) {
        if (specType === "number") {
          const parsedValue = Number.parseFloat(rawValue);
          if (!Number.isFinite(parsedValue)) {
            return;
          }
          values.push(parsedValue);
          conditions.push(`specs.${baseKey} = $${values.length}`);
          return;
        }

        if (specType === "boolean") {
          const parsedValue = parseBoolean(rawValue);
          if (parsedValue === undefined) {
            return;
          }
          values.push(parsedValue);
          conditions.push(`specs.${baseKey} = $${values.length}`);
          return;
        }

        values.push(rawValue);
        conditions.push(`LOWER(specs.${baseKey}) = LOWER($${values.length})`);
        return;
      }

      if (carType === "string") {
        values.push(rawValue);
        conditions.push(`LOWER(car.${baseKey}) = LOWER($${values.length})`);
      }
    });

    const whereClause = conditions.length
      ? ` WHERE ${conditions.join(" AND ")}`
      : "";

    const query = `
      SELECT car.*, specs.*
      FROM "Car Data".car car
      LEFT JOIN "Car Data".car_specs specs
        ON specs.car_id = car.car_id
      ${whereClause}
    `;

    const result = await pool.query(query, values);
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
