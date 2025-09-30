// api/sr-chat.js
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
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
          content: "You are a kind journaling companion. Help expand feelings into 3–5 journaling prompts. Keep it warm, gentle, and under 180 words."
        },
        { role: "user", content: userInput }
      ]
    });

    return res.status(200).json({ reply: response.output_text });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error." });
  }
}
