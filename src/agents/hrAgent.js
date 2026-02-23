const client = require("../elastic/client");
const queries = require("../esql/queries");

async function getEmployeeProfile(employeeId) {
  try {
    const result = await client.esql.query({
      query: queries.employeeProfile(employeeId)
    });

    if (!result.rows.length) {
      return "❌ Employee not found.";
    }

    const row = result.rows[0];

    return `
👤 *Employee Profile*
• ID: ${row[0]}
• Name: ${row[1]}
• Department: ${row[2]}
• Salary: ₹${row[3]}
• Performance Rating: ${row[4]}
`;
  } catch (error) {
    console.error("HR Agent Error:", error);
    return "⚠️ Failed to fetch employee profile.";
  }
}

async function getLeaveBalance(employeeId) {
  try {
    const result = await client.esql.query({
      query: queries.leaveBalance(employeeId)
    });

    if (!result.rows.length) {
      return "❌ Leave data not found.";
    }

    const row = result.rows[0];

    return `
🌴 *Leave Balance*
• Employee: ${employeeId}
• Leaves Taken: ${row[1]}
• Leaves Remaining: ${row[2]}
`;
  } catch (error) {
    console.error("Leave Agent Error:", error);
    return "⚠️ Failed to fetch leave balance.";
  }
}

module.exports = {
  getEmployeeProfile,
  getLeaveBalance
};
