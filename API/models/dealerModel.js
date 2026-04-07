const pool = require("../config/pool");

const DEALER_SUMMARY_SELECT = `
  SELECT
    dealership.dealer_id,
    dealership.dealer_name,
    dealership.location,
    dealership.is_franchised,
    COUNT(dealerinventory.dealerinventory_id)::int AS inventory_count
  FROM "Car Data".dealership dealership
  LEFT JOIN "Car Data".dealerinventory dealerinventory
    ON dealerinventory.dealer_id = dealership.dealer_id
`;

const DEALER_SUMMARY_GROUP_BY = `
  GROUP BY
    dealership.dealer_id,
    dealership.dealer_name,
    dealership.location,
    dealership.is_franchised
`;

const DEALER_LISTINGS_QUERY = `
  SELECT
    dealerinventory.dealerinventory_id,
    dealerinventory.dealer_id,
    dealerinventory.car_id,
    dealership.dealer_name,
    dealership.location,
    dealership.is_franchised,
    brands.name AS brand_name,
    car.name AS car_name,
    car.model,
    dealerlisting.price,
    dealerlisting.milage,
    dealerlisting.year,
    dealerlisting.condition::text AS condition
  FROM "Car Data".dealerinventory dealerinventory
  INNER JOIN "Car Data".dealership dealership
    ON dealership.dealer_id = dealerinventory.dealer_id
  INNER JOIN "Car Data".car car
    ON car.car_id = dealerinventory.car_id
  LEFT JOIN "Car Data".brands brands
    ON brands.brand_id = car.brand_id
  LEFT JOIN "Car Data".dealerlisting dealerlisting
    ON dealerlisting.dealerinventory_id = dealerinventory.dealerinventory_id
    AND dealerlisting.dealer_id = dealerinventory.dealer_id
`;

const dealerModel = {
  findAll: async () => {
    const result = await pool.query(
      `${DEALER_SUMMARY_SELECT}${DEALER_SUMMARY_GROUP_BY} ORDER BY dealership.dealer_name ASC`,
    );
    return result.rows;
  },

  findByCarIds: async (carIds = []) => {
    if (!Array.isArray(carIds) || !carIds.length) {
      return [];
    }

    const result = await pool.query(
      `
        ${DEALER_SUMMARY_SELECT}
        INNER JOIN (
          SELECT DISTINCT dealer_id
          FROM "Car Data".dealerinventory
          WHERE car_id = ANY($1::int[])
        ) matching_inventory
          ON matching_inventory.dealer_id = dealership.dealer_id
        ${DEALER_SUMMARY_GROUP_BY}
        ORDER BY dealership.dealer_name ASC
      `,
      [carIds],
    );
    return result.rows;
  },

  findById: async (dealerId) => {
    const result = await pool.query(
      `${DEALER_SUMMARY_SELECT} WHERE dealership.dealer_id = $1${DEALER_SUMMARY_GROUP_BY}`,
      [dealerId],
    );
    return result.rows[0] || null;
  },

  findListingsByDealerId: async (dealerId) => {
    const result = await pool.query(
      `${DEALER_LISTINGS_QUERY} WHERE dealerinventory.dealer_id = $1 ORDER BY brands.name ASC, car.name ASC, dealerinventory.dealerinventory_id ASC`,
      [dealerId],
    );
    return result.rows;
  },
};

module.exports = dealerModel;
