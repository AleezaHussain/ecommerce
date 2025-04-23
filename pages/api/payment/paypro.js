export default async function handler(req, res) {
    if (req.method !== 'POST') {
      console.log("❌ Invalid HTTP Method:", req.method);
      return res.status(405).end('Only POST allowed');
    }
  
    console.log("📥 Incoming request body:", req.body);
  
    const { name, email, phone, address, amount, orderNumber } = req.body;
  
    if (!name || !email || !phone || !address || !amount || !orderNumber) {
      console.error("❌ Missing required fields:", req.body);
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    const clientid = process.env.PAYPRO_CLIENT_ID;
    const clientsecret = process.env.PAYPRO_CLIENT_SECRET;
    const merchantId = process.env.PAYPRO_MERCHANT_ID;
  
    if (!clientid || !clientsecret || !merchantId) {
      console.error("❌ Missing environment variables");
      return res.status(500).json({ error: 'Server misconfiguration: missing env vars' });
    }
  
    try {
      // Step 1: Get Auth Token
      console.log("🔐 Requesting token from PayPro...");
      const authRes = await fetch('https://demoapi.paypro.com.pk/v2/ppro/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientid, clientsecret }),
      });
  
      const authText = await authRes.text();
      console.log("✅ Auth raw text response:", authText);
  
      const token = authRes.headers.get('Token');
      console.log("✅ Extracted Token from header:", token);
  
      if (!token) {
        console.error("❌ Token not found in headers");
        return res.status(500).json({ error: 'Failed to extract token from PayPro response headers' });
      }
  
      // Step 2: Create Order using provided orderNumber
      const orderPayload = [
        { MerchantId: merchantId },
        {
          OrderNumber: orderNumber, // ✅ from frontend
          OrderAmount: amount,
          OrderDueDate: '20/04/2025',
          OrderType: 'Product',
          IssueDate: '16/04/2025',
          OrderExpireAfterSeconds: '0',
          CustomerName: name,
          CustomerMobile: phone,
          CustomerEmail: email,
          CustomerAddress: address,
          ReturnURL: 'http://localhost:3000/?paypro=true', // optional: redirect for post-payment
        }
      ];
  
      console.log("📦 Sending order to PayPro:", orderPayload);
  
      const orderRes = await fetch('https://demoapi.paypro.com.pk/v2/ppro/co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Token: token,
        },
        body: JSON.stringify(orderPayload),
      });
  
      const orderData = await orderRes.json();
      console.log("✅ Order response from PayPro:", orderData);
  
      const paymentLink = orderData[1]?.Click2Pay || orderData[1]?.IframeClick2Pay;
  
      if (!paymentLink) {
        console.error("❌ Missing payment link in PayPro response:", orderData);
        return res.status(500).json({ error: 'Payment link not found in response' });
      }
  
      console.log("🌐 Redirecting user to:", paymentLink);
      return res.status(200).json({ paymentUrl: paymentLink });
  
    } catch (error) {
      console.error("🔥 Unexpected error:", error);
      return res.status(500).json({ error: error.message || 'Something went wrong' });
    }
  }
  