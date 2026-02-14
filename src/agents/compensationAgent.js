const client = require("../elastic/client");
const queries = require("../esql/queries");

async function simulateHike(percentage) {

  const result = await client.esql.query({
    query: queries.salaryBudgetSimulation(percentage)
  });

  if (!result.rows.length) {
    return "No salary data found.";
  }

  const row = result.rows[0];

  return `
💰 Hike Simulation
Total Salary Base: ${Math.round(row[0])}
Hike Budget Required: ${Math.round(row[1])}
`;
}

module.exports = { simulateHike };
