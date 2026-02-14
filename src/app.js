const express = require("express");
const slackRoutes = require("./slack/routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("PeopleOps AI Platform Running ✅");
});

app.use("/slack", slackRoutes);

module.exports = app;
