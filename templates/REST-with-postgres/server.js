// Require the framework and instantiate it
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, `.env.${process.env.NODE_ENV}`),
});

const createApp = require("./app");
const { pool } = require("./database/connect");

const start = async (options) => {
  const app = await createApp({ logger: true });

  try {
    app.listen({
      port: process.env.PORT,
      hostname: process.env.HOST,
    });
  } catch (err) {
    console.log(err);
    await pool.end();
    process.exit(1);
  }
};

start();
