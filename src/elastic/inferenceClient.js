const axios = require("axios");
const { loadEnv } = require("../config/env");

const {
  elasticServerlessEndpoint,
  elasticApiKey,
  elasticInferenceId
} = loadEnv();

async function runChat(prompt) {
  try {
    const response = await axios.post(
      `${elasticServerlessEndpoint}/_inference/${elasticInferenceId}`,
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

    if (!response.data?.completion?.length) {
      console.log("LLM returned empty response");
      return "";
    }

    return response.data.completion[0].result.trim();

  } catch (error) {
    console.error(
      "Inference Error:",
      error.response?.data || error.message
    );
    return "";
  }
}

module.exports = { runChat };
