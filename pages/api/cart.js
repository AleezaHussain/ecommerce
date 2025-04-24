import { supabase } from '../../lib/supabaseClientanon';
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

  // Verify JWT token for all methods
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

  try {
    switch (req.method) {
      case 'GET':
        return await handleGetCart(req, res, userId);
      case 'POST':
        return await handleUpdateCart(req, res, userId);
      default:
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Cart API Error:', error);
    return res.status(500).json({ 
      message: 'Server Error', 
      error: error.message 
    });
  }
}

async function handleGetCart(req, res, userId) {
  const { data, error } = await supabase
    .from('user_carts')
    .select('items')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // No rows found
      // Create empty cart if not exists
      const { error: createError } = await supabase
        .from('user_carts')
        .insert([{ user_id: userId, items: [] }])
        .select();

      if (createError) {
        console.error('Error creating new cart:', createError);
        throw createError;
      }
      
      return res.status(200).json({ items: [] });
    }
    console.error('Error fetching cart:', error);
    throw error;
  }

  return res.status(200).json({ 
    items: data?.items || [] 
  });
}

async function handleUpdateCart(req, res, userId) {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    return res.status(400).json({ message: 'Items must be an array' });
  }

  try {
    // Validate items
    const invalidItems = items.filter(item => (
      !item.medicine_id || 
      typeof item.quantity !== 'number' || 
      item.quantity <= 0 ||
      typeof item.price !== 'number' ||
      item.price <= 0
    ));

    if (invalidItems.length > 0) {
      return res.status(400).json({ 
        message: 'Invalid item format',
        invalidItems
      });
    }

    // Upsert cart
    const { data, error } = await supabase
      .from('user_carts')
      .upsert({
        user_id: userId,
        items,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ 
      success: true,
      cart: data
    });

  } catch (error) {
    console.error('Cart update error:', error);
    return res.status(500).json({ 
      message: 'Failed to update cart',
      error: error.message 
    });
  }
}