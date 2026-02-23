function employeeProfile(employeeId) {
  return `
    FROM hr_employees
    | WHERE employee_id == "${employeeId}"
    | KEEP employee_id, name, department, salary, performance_rating
  `;
}

function leaveBalance(employeeId) {
  return `
    FROM hr_leaves
    | WHERE employee_id == "${employeeId}"
    | KEEP employee_id, leaves_taken, leaves_remaining
  `;
}

function performanceSummary(employeeId) {
  return `
    FROM hr_performance
    | WHERE employee_id == "${employeeId}"
    | KEEP employee_id, rating, review_cycle
  `;
}

function compensationDetails(employeeId) {
  return `
    FROM hr_employees
    | WHERE employee_id == "${employeeId}"
    | KEEP employee_id, salary, bonus
  `;
}

module.exports = {
  employeeProfile,
  leaveBalance,
  performanceSummary,
  compensationDetails
};
