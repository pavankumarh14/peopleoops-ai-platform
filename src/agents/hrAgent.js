const client = require("../elastic/client");
const queries = require("../esql/queries");

async function getEmployeeProfile(employeeId) {

  const result = await client.esql.query({
    query: queries.employeeProfile(employeeId)
  });

  if (!result.rows.length) {
    return "Employee not found.";
  }

  const row = result.rows[0];

  return `
👤 Employee Profile
Name: ${row[1]}
Department: ${row[2]}
Salary: ${row[3]}
`;
}

module.exports = { getEmployeeProfile };
