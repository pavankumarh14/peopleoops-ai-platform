const hrAgent = require("./hrAgent");
const performanceAgent = require("./performanceAgent");
const compensationAgent = require("./compensationAgent");

async function route(intent, entities = {}) {
  try {
    switch (intent) {

      case "hike_simulation":
        return await compensationAgent.simulateHike(
          entities.percentage || 10
        );

      case "performance_summary":
        if (!entities.employee_id) {
          return "Please provide employee ID.";
        }
        return await performanceAgent.getPerformanceSummary(
          entities.employee_id
        );

      case "employee_lookup":
        if (!entities.employee_id) {
          return "Please provide employee ID.";
        }
        return await hrAgent.getEmployeeProfile(
          entities.employee_id
        );

      default:
        return "Intent not supported.";
    }
  } catch (error) {
    console.error("Router Error:", error);
    return "Something went wrong. Please try again.";
  }
}

module.exports = route;
