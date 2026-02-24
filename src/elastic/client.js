const { Client } = require("@elastic/elasticsearch");
const { loadEnv } = require("../config/env");

const { elasticServerlessEndpoint, elasticApiKey } = loadEnv();

const client = new Client({
  node: elasticServerlessEndpoint,
  auth: {
    apiKey: elasticApiKey
  }
});

module.exports = client;
