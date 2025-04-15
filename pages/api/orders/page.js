import { supabase } from '../../../lib/supabaseClientanon';
import jwt from 'jsonwebtoken';

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
    switch (req.method) {
      case 'POST':
        return await handlePostOrder(req, res);
      case 'GET':
        return await handleGetOrders(req, res);
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

async function handlePostOrder(req, res) {
  const { items, shippingInfo, paymentMethod, total, userId } = req.body;

  // Validate required fields
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Invalid or empty items array' });
  }
  if (!shippingInfo || !paymentMethod || !total) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Insert order into database
  const { data, error } = await supabase
    .from('orders')
    .insert([{
      user_id: userId || null, // Allow null for guest orders
      items,
      shipping_info: shippingInfo,
      payment_method: paymentMethod,
      total,
      status: 'processing'
    }])
    .select();
  
  if (error) throw error;
  
  return res.status(201).json({ 
    success: true,
    order: data[0]
  });
}

async function handleGetOrders(req, res) {
  // Verify JWT token
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

  // Fetch user's orders
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;

  return res.status(200).json({ 
    success: true,
    orders: data || []
  });
}