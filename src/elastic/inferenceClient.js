const client = require("./client");
const { loadEnv } = require("../config/env");

const { elasticInferenceId } = loadEnv();

async function runChat(messages) {
  try {
    const response = await client.transport.request({
      method: "POST",
      path: `/_inference/${elasticInferenceId}/_stream`,
      body: { messages },
      asStream: false   // 🔥 important
    });

    // response.body contains full text after stream ends
    const raw = response.body;

    // Extract all content pieces
    let finalText = "";

    if (Array.isArray(raw)) {
      raw.forEach(chunk => {
        if (chunk?.choices?.length) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) finalText += delta;
        }
      });
    }

    return finalText.trim();

  } catch (error) {
    console.error("Inference Error:", error);
    return "";
  }
}

module.exports = { runChat };
