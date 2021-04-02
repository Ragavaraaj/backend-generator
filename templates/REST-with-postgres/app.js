const fastify = require("fastify");
const autoload = require("fastify-autoload");
const path = require("path");
const cors = require("fastify-cors");

module.exports = async (options) => {
  const app = fastify(options);
  app.register(cors, {
    origin: false,
    methods: ["GET", "DELETE", "POST", "PATCH"],
  });
  app.register(autoload, {
    dir: path.join(__dirname, "./routes"),
  });
  return app;
};
