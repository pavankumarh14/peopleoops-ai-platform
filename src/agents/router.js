const hrAgent = require("./hrAgent");
const performanceAgent = require("./performanceAgent");
const compensationAgent = require("./compensationAgent");

/**
 * Central Router for ElasticHR Multi-Agent Platform
 */
async function route(intent, entities = {}) {
  try {
    if (!intent) {
      return "❌ No intent detected.";
    }

    switch (intent) {

      // 👤 Employee Profile
      case "employee_lookup":
        if (!entities.employee_id) {
          return "Please provide a valid employee ID (e.g., E001).";
        }
        return await hrAgent.getEmployeeProfile(
          entities.employee_id
        );

      // 📊 Performance Summary
      case "performance_summary":
        if (!entities.employee_id) {
          return "Please provide a valid employee ID.";
        }
        return await performanceAgent.getPerformanceSummary(
          entities.employee_id
        );

      // 💰 Compensation Details
      case "compensation_details":
        if (!entities.employee_id) {
          return "Please provide a valid employee ID.";
        }
        return await compensationAgent.getCompensationDetails(
          entities.employee_id
        );

      // 📈 Hike Simulation
      case "hike_simulation":
        const percentage = entities.percentage || 10;
        return await compensationAgent.simulateHike(
          percentage,
          entities.employee_id || null
        );

      // 🌴 Leave Balance
      case "leave_balance":
        if (!entities.employee_id) {
          return "Please provide a valid employee ID.";
        }
        return await hrAgent.getLeaveBalance(
          entities.employee_id
        );

      default:
        return "🤖 Sorry, I don’t support that request yet.";
    }

  } catch (error) {
    console.error("Router Error:", error);
    return "⚠️ Something went wrong while processing your request.";
  }
}

module.exports = route;
