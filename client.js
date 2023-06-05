async function main() {
  const clients = ["Ana", "Barbara", "Mario", "Dean", "John"];

  console.time("test");

  const promises = clients.map((client) => {
    return fetch(`https://0tx33gudsf.execute-api.us-east-1.amazonaws.com/dev`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ client }),
    });
  });

  const responses = await Promise.all(promises);

  responses.forEach(async (response) => {
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  });

  console.timeEnd("test");
}

main();
