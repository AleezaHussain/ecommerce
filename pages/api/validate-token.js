import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ valid: true });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
