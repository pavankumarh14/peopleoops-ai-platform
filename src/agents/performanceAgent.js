const client = require("../elastic/client");
const queries = require("../esql/queries");

async function getPerformanceSummary(employeeId) {
  try {
    const result = await client.esql.query({
      query: queries.performanceSummary(employeeId)
    });

    if (!result.rows.length) {
      return "❌ Performance data not found.";
    }

    const row = result.rows[0];

    return `
📊 *Performance Summary*
• Employee: ${employeeId}
• Rating: ${row[1]}
• Last Review Cycle: ${row[2]}
`;
  } catch (error) {
    console.error("Performance Agent Error:", error);
    return "⚠️ Failed to fetch performance summary.";
  }
}

module.exports = {
  getPerformanceSummary
};
