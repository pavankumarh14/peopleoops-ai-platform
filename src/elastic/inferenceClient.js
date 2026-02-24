// src/elastic/inferenceClient.js

const axios = require("axios");
const { loadEnv } = require("../config/env");

const {
  elasticUrl,
  elasticApiKey,
  elasticInferenceId
} = loadEnv();

async function runChat(prompt) {
  try {
    const response = await axios.post(
      `${elasticUrl}/_inference/${elasticInferenceId}`,
      {
        input: prompt
      },
      {
        headers: {
          Authorization: `ApiKey ${elasticApiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.data?.output?.length) {
      console.log("LLM returned empty response");
      return "";
    }

    return response.data.output[0].text.trim();
  } catch (error) {
    console.error(
      "Inference Error:",
      error.response?.data || error.message
    );
    return "";
  }
}

module.exports = { runChat };
