const { test } = require("tap");
const createApp = require("../app");
const options = { logger: true };

test('requests the "/" route', async (t) => {
  const app = await createApp(options);
  const response = await app.inject({
    method: "GET",
    url: "/",
  });
  t.strictEqual(response.statusCode, 200, "returns a status code of 200");
  await app.close();
});
