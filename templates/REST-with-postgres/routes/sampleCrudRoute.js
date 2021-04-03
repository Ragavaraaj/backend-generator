const commonQueries = require("../database/commonQueries");
const { TEST_TABLE_NAME } = require("../constant");
const sampleCrudRoute = async function (app) {
  const columns = [
    { name: "id", dataType: "serial", primaryKey: true },
    { name: "Name", dataType: "VARCHAR", dataTypeLength: 40 },
  ];

  app.get("/create-table", async (request, reply) => {
    const dbResponse = await commonQueries.createTable(
      TEST_TABLE_NAME,
      columns
    );
    reply.send(dbResponse);
  });

  app.get("/get-all-rows", async (request, reply) => {
    const dbResponse = await commonQueries.selectAll(TEST_TABLE_NAME);
    reply.send({ data: dbResponse.res.rows, status: dbResponse.status });
  });

  app.post("/insert-row", async (request, reply) => {
    const insertObj = { Name: request.body.name };
    const dbResponse = await commonQueries.insertRow(
      TEST_TABLE_NAME,
      insertObj
    );
    reply.send(dbResponse);
  });

  app.patch("/update-row", async (request, reply) => {
    const updateObj = { Name: request.body.name };
    const dbResponse = await commonQueries.updateRow(
      TEST_TABLE_NAME,
      updateObj,
      request.body.id
    );
    reply.send(dbResponse);
  });

  app.delete("/delete-row", async (request, reply) => {
    const dbResponse = await commonQueries.deleteRow(
      TEST_TABLE_NAME,
      request.body.id
    );
    reply.send(dbResponse);
  });
};
module.exports = sampleCrudRoute;
