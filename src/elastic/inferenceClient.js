// src/elastic/inferenceClient.js

const client = require("./client");
const { loadEnv } = require("../config/env");

const { elasticInferenceId } = loadEnv();

async function runChat(prompt) {
  try {
    const response = await client.inference.infer({
      inference_id: elasticInferenceId,
      input: prompt
    });

    if (!response?.output?.length) {
      console.log("LLM returned empty response");
      return "";
    }

    return response.output[0].text.trim();
  } catch (err) {
    console.error("Inference Error:", err);
    return "";
  }
}

module.exports = { runChat };
