// pages/api/qrlink.js
let latestImage = null;

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      // Validate incoming image
      if (!req.body?.image) {
        return res.status(400).json({ error: "No image provided" });
      }
      
      // Additional validation
      if (typeof req.body.image !== "string" || !req.body.image.startsWith('data:image')) {
        return res.status(400).json({ error: "Invalid image format" });
      }
      
      latestImage = req.body.image;
      console.log("Received image successfully");
      return res.status(200).json({ success: true });}
    } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}