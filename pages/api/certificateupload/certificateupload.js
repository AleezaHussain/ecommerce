import formidable from "formidable";
import fs from "fs";
import pdfParse from "pdf-parse";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  console.log("🚀 API called: /api/certificateupload/uploadcertificate");

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const form = formidable();
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    console.log("✅ Form parsed successfully!");
    const file = files.certification?.[0];

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Check if file is PDF or image
    const isPDF = file.mimetype === "application/pdf";
    const isImage = file.mimetype.startsWith("image/");

    if (!isPDF && !isImage) {
      return res.status(400).json({ 
        message: "Please upload either a PDF file or an image (JPEG, PNG, etc.)" 
      });
    }

    const dataBuffer = await fs.promises.readFile(file.filepath);
    console.log("📏 File size:", dataBuffer.length, "bytes");

    let extractedText = "";
    let imageBase64 = "";

    if (isPDF) {
      console.log("🔍 Extracting text from PDF...");
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text.trim();

      if (!extractedText) {
        return res.status(400).json({ message: "Failed to extract text from PDF" });
      }
    } else if (isImage) {
      console.log("🖼️ Processing image file...");
      imageBase64 = dataBuffer.toString("base64");
    }

    console.log("📡 Sending to Qwen2.5-VL-72B-Instruct...");
    
    let messages = [];
    
    if (isPDF) {
      messages = [
        {
          role: "system",
          content: "You are an AI assistant trained to extract key details from a manufacturer certificate.",
        },
        {
          role: "user",
          content: `Extract the following details in valid JSON format:
          - manufacturer_name
          - license_number
          - certificate_number
          - date_of_issue (YYYY-MM-DD)
          - address

          Return only the JSON object, without markdown formatting. Here is the extracted text:
          ${extractedText}`,
        },
      ];
    } else {
      messages = [
        {
          role: "system",
          content: "You are an AI assistant trained to extract key details from a manufacturer certificate image.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract the following details from this certificate image in valid JSON format:
              - manufacturer_name
              - license_number
              - certificate_number
              - date_of_issue (YYYY-MM-DD)
              - address
              
              Return only the JSON object, without markdown formatting.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${file.mimetype};base64,${imageBase64}`
              }
            }
          ]
        }
      ];
    }

    const qwenResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "qwen/qwen2.5-vl-72b-instruct:free",
        messages: messages,
        max_tokens: 500,
        temperature: 0.0,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "My App",
        },
      }
    );

    const structuredData = qwenResponse.data.choices[0]?.message?.content.trim();
    const cleanedJson = structuredData.replace(/```json|```/g, "").trim();
    const jsonData = JSON.parse(cleanedJson);

    if (jsonData.date_of_issue) {
      const date = new Date(jsonData.date_of_issue);
      if (!isNaN(date.getTime())) {
        jsonData.date_of_issue = date.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
      }
    }

    const fileBytea = dataBuffer.toString("base64");

    console.log("📡 Returning extracted data and Base64 file...");
    return res.status(200).json({
      message: "Certificate processed successfully",
      extractedData: jsonData,
      fileBytea,
      fileType: isPDF ? "pdf" : "image",
    });
  } catch (error) {
    console.error("❌ Unexpected error:", error?.response?.data || error);
    return res.status(500).json({ 
      message: "Internal Server Error",
      error: error.message 
    });
  }
}