const express = require("express");
const router = express.Router();
const handleSlackEvent = require("./slackApp");

router.post("/events", handleSlackEvent);

module.exports = router;
