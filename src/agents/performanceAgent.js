const client = require("../elastic/client");
const { runChat } = require("../elastic/inferenceClient");
const queries = require("../elastic/esql/queries");

async function processQuery(userQuery) {
  const esql = await runChat([
    { role: "system", content: "Convert this to ES|QL over hr_performance." },
    { role: "user", content: userQuery }
  ]);

  const result = await client.esql.query({ query: esql });
  return JSON.stringify(result.rows, null, 2);
}

module.exports = { processQuery };
