import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { website, imageUrl } = req.body; // Added imageUrl parameter
  if (!website) {
    return res.status(400).json({ message: 'Website URL is required' });
  }

  try {
    console.log(`🔍 Scraping: ${website}`);

    let pageContent = '';
    let images = [];

    // 🚀 Scrape website content and images
    try {
      const { data } = await axios.get(website, {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
        timeout: 5000,
      });

      const $ = cheerio.load(data);
      pageContent = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 5000);
      
      // Extract image URLs from the page
      $('img').each((i, elem) => {
        const src = $(elem).attr('src');
        if (src && src.startsWith('http')) {
          images.push(src);
        }
      });

      if (!pageContent && images.length === 0) {
        throw new Error("Empty website content and no images found");
      }
    } catch (cheerioError) {
      console.error('❌ Website Unreachable or Not Found:', cheerioError.message);
      return res.status(404).json({
        message: 'Website is unreachable or does not exist.',
        error: cheerioError.message,
      });
    }

    console.log(`📄 Extracted Content: ${pageContent.substring(0, 500)}...`);
    console.log(`🖼️ Found ${images.length} images on the page`);

    // 🔥 Prepare messages for Qwen2.5-VL (supports text and images)
    const messages = [];
    
    // System message
    messages.push({
      role: "system",
      content: "You are an AI trained to analyze pharmaceutical manufacturer websites. Evaluate the legitimacy based on content and images."
    });

    // Add text content if available
    if (pageContent) {
      messages.push({
        role: "user",
        content: `Website text content: ${pageContent}`
      });
    }

    // Add either the provided imageUrl or first image from the page
    const imageToAnalyze = imageUrl || (images.length > 0 ? images[0] : null);
    if (imageToAnalyze) {
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyze this image from the website:"
          },
          {
            type: "image_url",
            image_url: {
              url: imageToAnalyze
            }
          }
        ]
      });
    }

    // Final instruction
    messages.push({
      role: "user",
      content: "Provide a legitimacy probability score (0-100%) for this pharmaceutical manufacturer website based on both text and visual analysis. Return ONLY the percentage number without any additional text."
    });

    // 🚀 Send to Qwen2.5-VL-72B-Instruct
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "qwen/qwen2.5-vl-72b-instruct:free",
        messages: messages,
        max_tokens: 5,
        temperature: 0.0,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "Pharma Validator",
        },
      }
    );

    let probability = response.data.choices[0]?.message?.content?.trim();
    const probabilityMatch = probability.match(/\d+/);
    probability = probabilityMatch ? probabilityMatch[0] : "Unknown";

    console.log(`✅ Qwen2.5-VL Analysis Complete. Probability Score: ${probability}%`);

    res.status(200).json({
      website,
      probability,
      message: `${probability}%`,
      analyzedImage: imageToAnalyze || null,
      imagesFound: images.length
    });

  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: error.response?.data || null
    });
  }
}