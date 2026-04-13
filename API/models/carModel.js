const pool = require("../config/pool");

// Parses numeric filter values from query-string style input.
const parseNumber = (value) => {
  const parsedValue = Number.parseFloat(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

// Parses boolean filter values from query-string style input.
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

const carModel = {
  // Returns the lightweight car catalogue without joining the full specs row.
  findAll: async () => {
    const result = await pool.query(
      `SELECT c.car_id, c.name AS car_name, b.name AS brand_name
       FROM "Car Data".car c
       JOIN "Car Data".brands b ON b.brand_id = c.brand_id`,
    );
    return result.rows;
  },

  // Returns the broader car/specs feed used by details and diagnostics.
  findSpecs: async () => {
    const result = await pool.query(
      `SELECT c.car_id, c.name AS car_name, b.name AS brand_name, s.* 
       FROM "Car Data".car c
       JOIN "Car Data".car_specs s ON s.car_id = c.car_id
       JOIN "Car Data".brands b ON b.brand_id = c.brand_id
       WHERE s.horsepower IS NOT NULL`,
    );
    return result.rows;
  },

  // Builds the coarse SQL candidate set before recommendation scoring begins.
  findFiltered: async (filters = {}) => {
    const conditions = [];
    const values = [];
    const minPrice = parseNumber(filters.min_price);
    const maxPrice = parseNumber(filters.max_price);
    const isEv = parseBoolean(filters.is_ev);
    const bodyStyle =
      typeof filters.body_style === "string" && filters.body_style.trim()
        ? filters.body_style.trim()
        : "";
    const standardEngine =
      typeof filters.standard_engine === "string" && filters.standard_engine.trim()
        ? filters.standard_engine.trim()
        : "";
    const fuelType =
      typeof filters.fuel === "string" && filters.fuel.trim()
        ? filters.fuel.trim()
        : "";

    if (minPrice !== null) {
      values.push(minPrice);
      conditions.push(`specs.price >= $${values.length}`);
    }

    if (maxPrice !== null) {
      values.push(maxPrice);
      conditions.push(`specs.price <= $${values.length}`);
    }

    if (isEv !== undefined) {
      values.push(isEv);
      conditions.push(`specs.is_ev = $${values.length}`);
    }

    if (bodyStyle) {
      values.push(bodyStyle);
      conditions.push(`LOWER(specs.body_style) = LOWER($${values.length})`);
    }

    if (standardEngine) {
      values.push(`%${standardEngine}%`);
      conditions.push(`LOWER(COALESCE(specs.standard_engine, '')) LIKE LOWER($${values.length})`);
    }

    if (fuelType) {
      values.push(`%${fuelType}%`);
      conditions.push(`LOWER(COALESCE(specs.standard_engine, '')) LIKE LOWER($${values.length})`);
    }

    const whereClause = conditions.length
      ? ` WHERE ${conditions.join(" AND ")}`
      : "";

    const query = `
  SELECT 
    car.name AS car_name,
    brands.name AS brand_name,
    car.*,
    specs.*
  FROM "Car Data".car car
  JOIN "Car Data".car_specs specs
    ON specs.car_id = car.car_id
  JOIN "Car Data".brands brands
    ON brands.brand_id = car.brand_id
  ${whereClause}
`;

    const result = await pool.query(query, values);
    return result.rows;
  },

};

module.exports = carModel;
