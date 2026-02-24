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

You MUST return one of these EXACT intent values:

employee_lookup
performance_summary
hike_simulation
leave_balance
compensation_details
unknown

Return ONLY valid JSON in this format:

{
  "intent": "one_of_the_exact_values_above",
  "entities": {
    "employee_id": "E001",
    "percentage": 10
  }
}

Rules:
- Extract employee_id if present (format E###).
- Extract hike percentage if mentioned.
- If no percentage given for hike, default to 10.
- If no employee_id found, set it to null.
- If unsure, return intent as "unknown".
- Do NOT invent new intent names.
- Return JSON only. No explanation. No markdown.
`;

  try {
    const response = await runChat([
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ]);

    // Clean formatting issues (markdown wrappers etc.)
    const cleaned = response
      ?.replace(/```json/g, "")
      ?.replace(/```/g, "")
      ?.trim();

    if (!cleaned) {
      console.log("LLM returned empty response");
      return {
        intent: "unknown",
        entities: { employee_id: null, percentage: null }
      };
    }

    console.log("LLM Raw Response:", cleaned);

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Intent Parse Error:", err);
    return {
      intent: "unknown",
      entities: { employee_id: null, percentage: null }
    };
  }
}

/**
 * Slack Event Handler
 */
async function handleSlackEvent(req, res) {
  const body = req.body;

  // Slack URL verification
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
      let response;

      if (intent === "unknown") {
        response =
          "🤖 I can help with:\n" +
          "• Employee profile\n" +
          "• Performance summary\n" +
          "• Leave balance\n" +
          "• Hike simulation\n" +
          "• Compensation details\n\n" +
          "Please try one of these.";
      } else {
        response = await route(intent, entities);
      }

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
