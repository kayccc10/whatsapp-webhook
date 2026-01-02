const express = require("express");
const bodyParser = require("body-parser");
const app = express().use(bodyParser.json());

const VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;

// 1. Verification Endpoint (GET)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook Verified Successfully!");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// 2. Message Receiver (POST)
app.post("/webhook", (req, res) => {
  const body = req.body;
  if (body.object === "whatsapp_business_account") {
    // Return 200 OK immediately to avoid Meta retries
    res.sendStatus(200);
    
    // Log message for live debugging
    if (body.entry?.[0]?.changes?.[0]?.value?.messages) {
      console.log("New Message:", JSON.stringify(body.entry[0].changes[0].value.messages[0], null, 2));
    }
  } else {
    res.sendStatus(404);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Live Webhook listening on port ${PORT}));
