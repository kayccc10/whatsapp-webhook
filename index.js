const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

/**
 * Health check
 */
app.get("/", (req, res) => {
  res.send("WhatsApp backend running ✅");
});

/**
 * Webhook verification
 */
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (
    mode === "subscribe" &&
    token === process.env.WHATSAPP_VERIFY_TOKEN
  ) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

/**
 * Receive WhatsApp messages
 */
app.post("/webhook", (req, res) => {
  console.log("Incoming webhook:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
