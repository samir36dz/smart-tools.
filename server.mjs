import express from "express";
import OpenAI from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json({limit:"20kb"}));
app.use(express.static(__dirname));
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/ai", async (req, res) => {
  try {
    const message = String(req.body?.message || "").slice(0, 4000);
    const language = String(req.body?.language || "en");
    if (!message.trim()) return res.status(400).json({error:"Message is required"});
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-6-astra",
      instructions: "You are Smart Tools assistant. Reply clearly and helpfully in the user's selected language. Selected language code: " + language + ".",
      input: message,
      max_output_tokens: 700
    });
    res.json({reply: response.output_text || "No text response."});
  } catch (error) {
    console.error("AI request failed:", error.message);
    res.status(500).json({error:"AI service temporarily unavailable"});
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Smart Tools server listening on ${port}`));
