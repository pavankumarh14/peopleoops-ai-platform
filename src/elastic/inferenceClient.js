const client = require("./client");
const { loadEnv } = require("../config/env");

const { elasticInferenceId } = loadEnv();

async function runChat(messages) {
  const response = await client.inference.infer({
    inference_id: elasticInferenceId,
    input: { messages }
  });

  if (!response.output?.length) {
    throw new Error("No inference output");
  }

  return response.output[0].content[0].text;
}

module.exports = { runChat };
