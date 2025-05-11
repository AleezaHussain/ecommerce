import { OpenAI } from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { name, expiryDate, excipients, description } = req.body;

    if (!name || !expiryDate || !excipients || !description) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Convert excipients array into a readable string
    const excipientsList = excipients.length > 0 ? excipients.join(", ") : "No excipients listed";

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // If expiry date has passed, automatically return "No" (Suspicious)
    if (expiryDate < today) {
      return res.status(200).json({ 
        isAuthentic: "No",
        message: "This medicine is expired and therefore suspicious."
      });
    }

    // Construct the AI prompt
    const prompt = `
    Analyze the following medicine details and determine if it is **authentic** or **suspicious**.

    **IMPORTANT RULES:**
    - If the **expiry date has passed**, return **"No"** (Suspicious).
    - If the **description does not match** the medicine name (e.g., "COVID Vaccine" treating "leg pain"), return **"No"** (Suspicious).

    **Medicine Details:**
    - **Name:** ${name}
    - **Expiry Date:** ${expiryDate} (Check if expired)
    - **Excipients:** ${excipientsList}
    - **Description:** ${description} (Verify if it matches the medicine name)

    If the medicine is **authentic**, return **"Yes"**.
    If the medicine is **suspicious**, return **"No"**.

    **Output format:** Only return **"Yes"** or **"No"**, without any extra words.
    `;

    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
    });

    const completion = await client.chat.completions.create({
      model: "nousresearch/deephermes-3-llama-3-8b-preview:free",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2,
      temperature: 0,
    });

    let aiResponse = completion.choices?.[0]?.message?.content.trim() || "No response";
    const isAuthentic = aiResponse.toLowerCase().startsWith("yes") ? "Yes" : "No";

    return res.status(200).json({ 
      isAuthentic,
      message: isAuthentic === "Yes" 
        ? "This medicine appears to be authentic based on the provided details." 
        : "This medicine has been flagged as suspicious. Please review carefully."
    });
  } catch (error) {
    console.error("Error fetching response:", error);
    return res.status(500).json({ 
      error: "Internal Server Error",
      isAuthentic: "No",
      message: "Could not verify authenticity due to an error."
    });
  }
}