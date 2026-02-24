const client = require("./client");
const { loadEnv } = require("../config/env");

const { elasticInferenceId } = loadEnv();

async function runChat(messages) {
  const stream = await client.transport.request({
    method: "POST",
    path: `/_inference/${elasticInferenceId}/_stream`,
    body: {
      messages
    }
  });

  let finalText = "";

  for await (const event of stream) {
    // Ignore DONE event
    if (!event || event === "[DONE]") continue;

    if (event.choices?.length) {
      const delta = event.choices[0]?.delta?.content;
      if (delta) {
        finalText += delta;
      }
    }
  }

  return finalText.trim();
}

module.exports = { runChat };
