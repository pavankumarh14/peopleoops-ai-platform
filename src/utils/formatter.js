function formatCurrency(value) {
  return `$${Number(value).toLocaleString()}`;
}

module.exports = { formatCurrency };
