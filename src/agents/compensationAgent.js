const { Client } = require("@elastic/elasticsearch");

const client = new Client({
  node: process.env.ELASTIC_URL,
  auth: { apiKey: process.env.ELASTIC_API_KEY }
});

async function simulateHike(percent, ratingThreshold = 4.5) {
  try {

    // STEP 1: Get High Performers
    const perfResponse = await client.transport.request({
      method: "POST",
      path: "/_query",
      body: {
        query: `
          FROM hr_performance
          | WHERE rating >= ${ratingThreshold}
          | KEEP employee_id
        `
      }
    });

    if (!perfResponse.values || perfResponse.values.length === 0) {
      return "⚠ No employees meet the performance criteria.";
    }

    const employeeIds = perfResponse.values.map(row => row[0]);

    // STEP 2: Get Salary Data
    const idList = employeeIds.map(id => `"${id}"`).join(",");

    const salaryResponse = await client.transport.request({
      method: "POST",
      path: "/_query",
      body: {
        query: `
          FROM hr_employees
          | WHERE employee_id IN (${idList})
          | STATS total_salary = SUM(salary), headcount = COUNT(*)
        `
      }
    });

    if (!salaryResponse.values || salaryResponse.values.length === 0) {
      return "⚠ Salary data not found.";
    }

    const totalSalary = salaryResponse.values[0][0];
    const headcount = salaryResponse.values[0][1];

    // STEP 3: Calculate Hike
    const hikeCost = totalSalary * (percent / 100);
    const newBudget = totalSalary + hikeCost;

    return `
📊 Selective Compensation Simulation

🎯 Performance Threshold: ${ratingThreshold}+
👥 Eligible Employees: ${headcount}

💰 Current Budget (Eligible Group): ₹${Math.round(totalSalary).toLocaleString()}
📈 ${percent}% Hike Cost: ₹${Math.round(hikeCost).toLocaleString()}
💵 New Budget Required: ₹${Math.round(newBudget).toLocaleString()}
    `;

  } catch (error) {
    console.error(error);
    return "❌ Error processing compensation simulation.";
  }
}

module.exports = { simulateHike };
