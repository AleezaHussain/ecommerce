
import { supabase } from '../../../lib/supabaseClientanon';

// import { supabase } from '../../../lib/supabaseClientservice';


import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  try {
    // 🔍 Fetch user from Supabase
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 🔒 Validate password
    const isValidPassword = await bcrypt.compare(password, data.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 🔐 Generate JWT Token
    const token = jwt.sign(
      { id: data.id, email: data.email, role: data.role },
      process.env.JWT_SECRET,
      { expiresIn: '5h' } 
    );

    console.log("🔐 [DEBUG] JWT Token Generated:", token);

    // 🍪 Store JWT in an HTTP-only cookie
    res.setHeader(
      'Set-Cookie',
      serialize('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Secure only in production
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 5, // 5 hours
      })
    );

    // 🛡 Remove password from response
    const { password: _, ...userData } = data;

    res.status(200).json({ message: 'Login successful', user: userData });
  } catch (err) {
    console.error("❌ [ERROR] Server Error:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}
