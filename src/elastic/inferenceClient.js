const client = require("./client");

const INFERENCE_ID = ".openai-gpt-4.1-mini-chat_completion";

async function runChat(messages) {
  const response = await client.inference.infer({
    inference_id: INFERENCE_ID,
    input: { messages }
  });
  return response.output?.[0]?.content?.[0]?.text || "";
}

module.exports = { runChat };
