module.exports = {

  employeeProfile: (id) => `
    FROM hr_employees
    | WHERE employee_id == "${id}"
  `,

  performanceAverage: (id) => `
    FROM hr_performance
    | WHERE employee_id == "${id}"
    | STATS avg_rating = AVG(rating)
  `,

  salaryBudgetSimulation: (percentage) => `
    FROM hr_employees
    | STATS total_salary = SUM(salary)
    | EVAL hike_budget = total_salary * ${percentage / 100}
  `
};
