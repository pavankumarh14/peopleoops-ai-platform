const client = require("../elastic/client");
const queries = require("../esql/queries");

async function getPerformanceSummary(employeeId) {
  try {
    const result = await client.esql.query({
      query: queries.performanceSummary(employeeId)
    });

    // 🔥 FIX: use result.values (Serverless ES|QL format)
    if (!result.values || result.values.length === 0) {
      return "❌ Performance data not found.";
    }

    const row = result.values[0];

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
