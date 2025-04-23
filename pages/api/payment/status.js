// pages/api/paypro/status.js

export default async function handler(req, res) {
    const { orderNumber } = req.query;
  
    const clientid = process.env.PAYPRO_CLIENT_ID;
    const clientsecret = process.env.PAYPRO_CLIENT_SECRET;
  
    try {
      // Step 1: Get Token
      const authRes = await fetch('https://demoapi.paypro.com.pk/v2/ppro/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientid, clientsecret }),
      });
  
      const token = authRes.headers.get('Token');
      if (!token) throw new Error("No token returned");
  
      // Step 2: Check Order Status
      const statusRes = await fetch(
        `https://demoapi.paypro.com.pk/v2/ppro/gs/${orderNumber}`,
        {
          method: 'GET',
          headers: { Token: token },
        }
      );
  
      const statusData = await statusRes.json();
      console.log("🧾 PayPro Status Response:", statusData);
  
      const paymentStatus = statusData[1]?.OrderStatus;
  
      if (paymentStatus === "Paid") {
        // Redirect to local success page
        return res.redirect(302, 'http://localhost:3000');
      } else {
        return res.status(200).json({ status: paymentStatus });
      }
    } catch (err) {
      console.error("Error checking PayPro order status:", err);
      return res.status(500).json({ error: err.message });
    }
  }
  