export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const { messages, system } = req.body || {};
  const apiKey = process.env.GROQ_API_KEY;
  
  console.log("Key exists:", !!apiKey);
  console.log("Messages:", JSON.stringify(messages));

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: system || "You are a helpful finance assistant." },
          ...messages
        ],
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    console.log("Groq full response:", JSON.stringify(data));
    
    if (data.error) {
      console.error("Groq error:", data.error);
      return res.status(200).json({ content: [{ text: "Error: " + data.error.message }] });
    }

    const text = data.choices?.[0]?.message?.content || "Unable to respond right now.";
    console.log("Returning text:", text.substring(0, 100));
    return res.status(200).json({ content: [{ text }] });
  } catch (err) {
    console.error("Catch error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}