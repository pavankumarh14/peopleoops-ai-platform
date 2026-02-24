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
  "intent": "employee_lookup | performance_summary | hike_simulation | leave_balance | compensation_details | unknown",
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
- If you cannot classify, return intent as "unknown".
- Return ONLY JSON. No explanation. No markdown.
`;

  try {
    const response = await runChat([
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ]);

    // 🔥 Clean common LLM formatting issues
    const cleaned = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("LLM Raw Response:", cleaned);

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Intent Parse Error:", err);

    return {
      intent: "unknown",
      entities: {
        employee_id: null,
        percentage: null
      }
    };
  }
}

/**
 * Slack Event Handler
 */
async function handleSlackEvent(req, res) {
  const body = req.body;

  // Slack verification challenge
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
      const text = body.event.text?.trim();
      const channel = body.event.channel;

      if (!text) return;

      // 1️⃣ Detect intent
      const parsed = await detectIntent(text);

      const { intent, entities } = parsed;

      console.log("Detected Intent:", intent);
      console.log("Entities:", entities);

      // 2️⃣ Route request
      const response = await route(intent, entities);

      // 3️⃣ Reply to Slack
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
  try {
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
  } catch (err) {
    console.error("Slack Post Error:", err.response?.data || err.message);
  }
}

module.exports = handleSlackEvent;
