import jwt from 'jsonwebtoken';

export async function verifyToken(token) {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user exists in database
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('id', decoded.id)
      .single();

    if (error || !user) return null;
    
    return user;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}