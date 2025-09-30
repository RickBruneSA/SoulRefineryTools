// api/sr-chat.js
// api/sr-chat.js
import OpenAI from "openai";

const allowedOrigins = [
  "https://thesoulrefinery.com, // ← change this
  "http://localhost:3000"          // optional for local testing
];

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  // Basic CORS headers
  res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Reply OK to preflight checks
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userInput } = req.body || {};
    if (!userInput) {
      return res.status(400).json({ error: "Missing userInput" });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.responses.create({
      model: "gpt-5.1-mini",
      input: [
        {
          role: "system",
          content:
            "You are a kind journaling companion. Help expand feelings into 3–5 journaling prompts. Keep it warm, gentle, and under 180 words."
        },
        { role: "user", content: userInput }
      ]
    });

    return res.status(200).json({ reply: response.output_text || "I’m here—try again?" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error." });
  }
}
