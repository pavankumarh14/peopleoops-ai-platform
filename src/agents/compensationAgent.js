const { runChat } = require("../elastic/inferenceClient");

async function processQuery(userQuery) {
  const response = await runChat([
    { role: "system", content: "Compensation wise summary:" },
    { role: "user", content: userQuery }
  ]);
  return response;
}

module.exports = { processQuery };
