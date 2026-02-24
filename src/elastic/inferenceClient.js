const client = require("./client");
const { loadEnv } = require("../config/env");

const { elasticInferenceId } = loadEnv();

async function runChat(messages) {
  try {
    const response = await client.transport.request({
      method: "POST",
      path: `/_inference/${elasticInferenceId}`,
      body: {
        input: {
          messages
        }
      }
    });

    if (!response.output || !response.output.length) {
      throw new Error("No inference output");
    }

    return response.output[0].content[0].text;

  } catch (error) {
    console.error("Inference Error:", error);
    throw error;
  }
}

module.exports = { runChat };
