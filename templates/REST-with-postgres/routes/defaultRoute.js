const defaultRoute = async function (app) {
  app.get("/", async (request, reply) => {
    return { message: "Hello World!!!" };
  });
};
module.exports = defaultRoute;
