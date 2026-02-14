const hrAgent = require("./hrAgent");
const performanceAgent = require("./performanceAgent");
const compensationAgent = require("./compensationAgent");

async function route(intent, entities) {

  switch (intent) {

    case "hike_simulation":
      return await compensationAgent.simulateHike(
        entities.percentage
      );

    case "performance_summary":
      return await performanceAgent.getPerformanceSummary(
        entities.employee_id
      );

    case "employee_lookup":
      return await hrAgent.getEmployeeProfile(
        entities.employee_id
      );

    default:
      return "Intent not supported.";
  }
}

module.exports = route;
