const axios = require("axios");
const route = require("../agents/router");
const { runChat } = require("../elastic/inferenceClient");

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

/**
 * Detect intent + entities using LLM
 */
async function detectIntent(userMessage) {
  const systemPrompt = `
You are an HR intent classifier.

Return ONLY valid JSON like this:
{
  "intent": "employee_lookup | performance_summary | hike_simulation | leave_balance | compensation_details",
  "entities": {
    "employee_id": "E001",
    "percentage": 10
  }
}

Rules:
- Extract employee_id if present (format E###).
- Extract hike percentage if mentioned.
- If no percentage given for hike, default to 10.
- If no employee_id, set it to null.
- Return ONLY JSON. No explanation.
`;

  const response = await runChat([
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage }
  ]);

  try {
    return JSON.parse(response);
  } catch (err) {
    console.error("Intent Parse Error:", err);
    return null;
  }
}

/**
 * Slack Event Handler
 */
async function handleSlackEvent(req, res) {
  const body = req.body;

  // Slack verification
  if (body.type === "url_verification") {
    return res.json({ challenge: body.challenge });
  }

  // Acknowledge immediately
  res.sendStatus(200);

  try {
    if (
      body.event &&
      body.event.type === "message" &&
      !body.event.bot_id
    ) {
      const text = body.event.text.trim();
      const channel = body.event.channel;

      // 🔥 1️⃣ Detect intent dynamically
      const parsed = await detectIntent(text);

      if (!parsed) {
        return await postMessage(channel, "❌ Could not understand request.");
      }

      const { intent, entities } = parsed;

      // 🔥 2️⃣ Route dynamically
      const response = await route(intent, entities);

      // 🔥 3️⃣ Reply to Slack
      await postMessage(channel, response);
    }
  } catch (error) {
    console.error("Slack Error:", error);
  }
}

/**
 * Slack Message Sender
 */
async function postMessage(channel, text) {
  await axios.post(
    "https://slack.com/api/chat.postMessage",
    {
      channel,
      text
    },
    {
      headers: {
        Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );
}

module.exports = handleSlackEvent;
