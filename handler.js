"use strict";

const globalData = {
  counter: 0,
  client: "",
  clients: [],
};

function stringify(object) {
  return JSON.stringify(object, null, 2);
}

function simulateAsyncIO() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("ok");
    }, 1000);
  });
}

module.exports.handler = async function (event) {
  const { client } = JSON.parse(event.body);

  console.log("1. before mutation", stringify({ client, globalData }));

  globalData.counter++;
  globalData.client = client;
  globalData.clients.push(client);

  console.log("2. after mutation", stringify({ client, globalData }));

  await simulateAsyncIO();
  console.log("3. simulateAsyncIO", stringify({ client, globalData }));

  await simulateAsyncIO();
  console.log("4. simulateAsyncIO", stringify({ client, globalData }));

  await simulateAsyncIO();
  console.log("5. simulateAsyncIO", stringify({ client, globalData }));

  await simulateAsyncIO();
  console.log("6. simulateAsyncIO", stringify({ client, globalData }));

  await simulateAsyncIO();
  console.log("7. simulateAsyncIO (end)", stringify({ client, globalData }));

  return {
    statusCode: 200,
    body: stringify({
      client,
      globalData,
      message: "ok",
    }),
  };
};
