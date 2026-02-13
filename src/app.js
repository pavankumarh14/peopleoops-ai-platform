// Express app configuration
const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'PeopleOops AI Platform API' });
});

module.exports = app;
