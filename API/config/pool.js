const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;
const isLocalDatabase =
  typeof connectionString === "string" &&
  /(localhost|127\.0\.0\.1)/i.test(connectionString);
const useSsl = !isLocalDatabase && process.env.PGSSLMODE !== "disable";

const pool = new Pool({
  connectionString,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 10,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

module.exports = pool;
