import { supabase } from '../../lib/supabaseClientanon';
import jwt from 'jsonwebtoken';
import { validateCartItems, batchDecrementQuantities } from "../../lib/saleMedicineDb";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Verify JWT token for all methods except OPTIONS
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authorization token required' });
    }

    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    switch (req.method) {
      case 'GET':
        // Handle GET request - fetch user's orders
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Supabase fetch error:', error);
          throw error;
        }
        
        return res.status(200).json({ 
          success: true,
          orders: data || []  // Match the frontend expectation
        });

      case 'POST':
        // Handle POST request - create new order
        const { items, shippingInfo, paymentMethod, total } = req.body;

        // Validate required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
          return res.status(400).json({ message: 'Invalid or empty items array' });
        }
        if (!shippingInfo || !paymentMethod || !total) {
          return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate items are available
        const validationResults = await validateCartItems(items);
        const invalidItems = validationResults.filter(item => !item.valid);
        
        if (invalidItems.length > 0) {
          return res.status(400).json({
            message: 'Some items are no longer available',
            invalidItems
          });
        }

        // Insert order into database
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert([{
            user_id: userId,
            items,
            shipping_info: shippingInfo,
            payment_method: paymentMethod,
            total,
            status: 'processing'
          }])
          .select();
        
        if (orderError) {
          console.error('Supabase insert error:', orderError);
          throw orderError;
        }

        // Decrement quantities
        await batchDecrementQuantities(items.map(item => ({
          medicine_id: item.medicine_id,
          quantity: item.quantity
        })));
        
        return res.status(201).json({ 
          success: true,
          order: orderData[0]
        });

      default:
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Orders API Error:', error);
    return res.status(500).json({ 
      message: 'Server Error', 
      error: error.message 
    });
  }
}