const pool = require("../config/pool");

const dealerModel = {
  findAll: async () => {
    const result = await pool.query(
      `${BASE_DEALER_QUERY} ORDER BY dealership.dealer_name ASC`,
    );
    return result.rows;
  },

  findFiltered: async (filters = {}) => {
    const { whereClause, values } = buildDealerFilterQuery(filters);
    const result = await pool.query(
      `${BASE_DEALER_QUERY}${whereClause} ORDER BY dealership.dealer_name ASC`,
      values,
    );
    return result.rows;
  },

  findById: async (dealerId) => {
    const result = await pool.query(
      `${BASE_DEALER_QUERY} WHERE dealership.dealer_id = $1`,
      [dealerId],
    );
    return result.rows[0] || null;
  },
};

const DEALER_FIELDS = {
  dealer_id: "number",
  dealer_name: "string",
  location: "string",
  is_franchised: "boolean",
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

const buildDealerFilterQuery = (filters = {}) => {
  const conditions = [];
  const values = [];

  Object.entries(filters).forEach(([key, rawValue]) => {
    if (
      rawValue === undefined ||
      rawValue === null ||
      `${rawValue}`.trim().length === 0
    ) {
      return;
    }

    const fieldType = DEALER_FIELDS[key];
    if (!fieldType) {
      return;
    }

    if (fieldType === "number") {
      const parsedValue = Number.parseInt(rawValue, 10);
      if (!Number.isFinite(parsedValue)) {
        return;
      }
      values.push(parsedValue);
      conditions.push(`dealership.${key} = $${values.length}`);
      return;
    }

    if (fieldType === "boolean") {
      const parsedValue = parseBoolean(rawValue);
      if (parsedValue === undefined) {
        return;
      }
      values.push(parsedValue);
      conditions.push(`dealership.${key} = $${values.length}`);
      return;
    }

    values.push(rawValue);
    conditions.push(`LOWER(dealership.${key}) = LOWER($${values.length})`);
  });

  return {
    whereClause: conditions.length ? ` WHERE ${conditions.join(" AND ")}` : "",
    values,
  };
};

const BASE_DEALER_QUERY = `
  SELECT
    dealership.dealer_id,
    dealership.dealer_name,
    dealership.location,
    dealership.is_franchised
  FROM "Car Data".dealership dealership
`;

module.exports = dealerModel;
