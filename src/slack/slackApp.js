const axios = require("axios");
const route = require("../agents/router");

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

async function handleSlackEvent(req, res) {

  const body = req.body;

  // Slack URL verification
  if (body.type === "url_verification") {
    return res.json({ challenge: body.challenge });
  }

  // Acknowledge immediately
  res.sendStatus(200);

  if (body.event && body.event.type === "message" && !body.event.bot_id) {

    const text = body.event.text.toLowerCase();
    const channel = body.event.channel;

    let response = "I didn’t understand that.";

    if (text.includes("hike")) {
      response = await route("hike_simulation", { percentage: 8 });
    }

    // Post message using Slack API
    await axios.post(
      "https://slack.com/api/chat.postMessage",
      {
        channel: channel,
        text: response
      },
      {
        headers: {
          Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
  }
}

module.exports = handleSlackEvent;
