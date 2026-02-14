const client = require("../elastic/client");
const queries = require("../esql/queries");

async function getPerformanceSummary(employeeId) {

  const result = await client.esql.query({
    query: queries.performanceAverage(employeeId)
  });

  if (!result.rows.length) {
    return "No performance data found.";
  }

  const avgRating = result.rows[0][0];

  return `
📈 Performance Summary
Average Rating: ${avgRating.toFixed(2)}
`;
}

module.exports = { getPerformanceSummary };
