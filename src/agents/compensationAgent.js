const client = require("../elastic/client");
const queries = require("../esql/queries");

async function getCompensationDetails(employeeId) {
  try {
    const result = await client.esql.query({
      query: queries.compensationDetails(employeeId)
    });

    if (!result.rows.length) {
      return "❌ Compensation data not found.";
    }

    const row = result.rows[0];

    return `
💰 *Compensation Details*
• Employee: ${employeeId}
• Current Salary: ₹${row[1]}
• Bonus: ₹${row[2]}
`;
  } catch (error) {
    console.error("Compensation Agent Error:", error);
    return "⚠️ Failed to fetch compensation details.";
  }
}

async function simulateHike(percentage, employeeId = null) {
  try {
    if (!employeeId) {
      return `📈 Simulated a ${percentage}% hike (employee ID required for exact calculation).`;
    }

    const result = await client.esql.query({
      query: queries.compensationDetails(employeeId)
    });

    if (!result.rows.length) {
      return "❌ Employee not found.";
    }

    const currentSalary = result.rows[0][1];
    const newSalary = currentSalary + (currentSalary * percentage / 100);

    return `
📈 *Hike Simulation*
• Employee: ${employeeId}
• Current Salary: ₹${currentSalary}
• Hike: ${percentage}%
• New Salary: ₹${Math.round(newSalary)}
`;
  } catch (error) {
    console.error("Hike Simulation Error:", error);
    return "⚠️ Failed to simulate hike.";
  }
}

module.exports = {
  getCompensationDetails,
  simulateHike
};
