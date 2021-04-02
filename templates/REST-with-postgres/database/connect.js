const { Pool } = require("pg");
const { FAIL, SUCCESS } = require("../constant");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
});

const executeQuery = async ({ query, arg }) => {
  const client = await pool.connect();
  try {
    const res = await client.query(query, arg);
    client.release();
    return { status: SUCCESS, res };
  } catch (err) {
    client.release();
    console.log(`error on querring ${query}`);
    return { status: FAIL, err };
  }
};

module.exports = { executeQuery, pool };
