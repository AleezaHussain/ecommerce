import formidable from "formidable";
import fs from "fs";
import pdfParse from "pdf-parse";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
  },
};

export default async function handler(req, res) {
  console.log("🚀 API called: /api/medicineregistration/autofill");

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const form = formidable();

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("❌ Error parsing form:", err);
          reject(err);
        } else {
          resolve([fields, files]);
        }
      });
    });

    console.log("✅ Form parsed successfully!");
    const file = files.certificate?.[0];

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Validate file type
    if (file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Please upload a valid PDF file." });
    }

    console.log("🔍 Reading PDF file...");
    const dataBuffer = await fs.promises.readFile(file.filepath);
    console.log("📏 PDF file size:", dataBuffer.length, "bytes");

    console.log("🔍 Extracting text from PDF...");
    const pdfData = await pdfParse(dataBuffer);
    let extractedText = pdfData.text.trim();

    if (!extractedText) {
      return res.status(400).json({ message: "Failed to extract text from PDF" });
    }

    console.log("📡 Sending extracted text to Qwen AI...");
    const qwenResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "qwen/qwen2.5-vl-72b-instruct:free",
        messages: [
          {
            role: "system",
            content:
              "You are an AI assistant trained to extract medicine details from a certificate.",
          },
          {
            role: "user",
            content: `Extract the following details in **valid JSON format**:
            - medicine_id
            - medicine_name
            - dosage_form
            - batch_number
            - excipients (array format)

            Return only the JSON object, **without markdown formatting**. Here is the extracted text:
            ${extractedText}`,
          },
        ],
        max_tokens: 200,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.YOUR_SITE_URL || "http://localhost:3000",
          "X-Title": process.env.YOUR_SITE_NAME || "Medicine Registration App",
        },
      }
    );

    const structuredData =
      qwenResponse.data.choices?.[0]?.message?.content?.trim() || "";
    console.log("🔍 AI Raw Response:", structuredData);

    if (!structuredData) {
      throw new Error("AI response is empty. Check the extracted text or AI model response.");
    }

    const cleanedJson = structuredData.replace(/```json|```/g, "").trim();

    let jsonData;
    try {
      jsonData = JSON.parse(cleanedJson);
    } catch (jsonError) {
      console.error("❌ JSON Parsing Error:", jsonError);
      return res.status(500).json({
        message: "Error parsing AI response. Please check the format.",
      });
    }

    console.log("✅ Extracted Data:", jsonData);
    return res.status(200).json({
      message: "Certificate processed successfully",
      extractedData: jsonData,
    });
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}