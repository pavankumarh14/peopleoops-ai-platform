const axios = require("axios");
const route = require("../agents/router");
const { runChat } = require("../elastic/inferenceClient");

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

/**
 * Detect intent + entities using LLM
 */
async function detectIntent(userMessage) {
  const prompt = `
Classify the HR intent of this message:

"${userMessage}"

Return ONLY one word from this list:

employee_lookup
performance_summary
hike_simulation
leave_balance
compensation_details
unknown
`;

  try {
    const response = await runChat(prompt);

    if (!response) {
      return {
        intent: "unknown",
        entities: { employee_id: null, percentage: null }
      };
    }

    const intent = response.trim();

    // Extract employee_id manually (E###)
    const employeeMatch = userMessage.match(/E\d+/i);
    const employee_id = employeeMatch ? employeeMatch[0].toUpperCase() : null;

    // Extract percentage manually (for hike simulation)
    const percentageMatch = userMessage.match(/(\d+)\s*%/);
    const percentage =
      percentageMatch && intent === "hike_simulation"
        ? parseInt(percentageMatch[1])
        : intent === "hike_simulation"
        ? 10
        : null;

    console.log("Detected Intent:", intent);
    console.log("Entities:", { employee_id, percentage });

    return {
      intent,
      entities: { employee_id, percentage }
    };
  } catch (err) {
    console.error("Intent Error:", err);
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
