const client = require("./client");
const { loadEnv } = require("../config/env");

const { elasticInferenceId } = loadEnv();

async function runChat(messages) {
  try {
    const response = await client.transport.request({
      method: "POST",
      path: `/_inference/${elasticInferenceId}/_stream`,
      body: { messages },
      headers: {
        accept: "text/event-stream"
      }
    });

    let finalText = "";

    // The response is a raw stream
    const stream = response.body;

    for await (const chunk of stream) {
      const chunkStr = chunk.toString();

      // Split multiple events if present
      const lines = chunkStr.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const jsonPart = line.replace("data: ", "").trim();

          if (jsonPart === "[DONE]") continue;

          try {
            const parsed = JSON.parse(jsonPart);

            if (parsed.choices?.length) {
              const delta = parsed.choices[0]?.delta?.content;
              if (delta) {
                finalText += delta;
              }
            }
          } catch (err) {
            // Ignore partial JSON chunks
          }
        }
      }
    }

    return finalText.trim();

  } catch (error) {
    console.error("Inference Error:", error);
    return "";
  }
}

module.exports = { runChat };
