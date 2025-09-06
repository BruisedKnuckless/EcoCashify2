const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In-memory database for demo purposes
// In production, you'd use a proper database like PostgreSQL
let users = [];
let nextUserId = 1;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: nextUserId++,
      username,
      email,
      password: hashedPassword,
      created_at: new Date().toISOString()
    };
    users.push(user);

    const token = jwt.sign(
      { id: user.id, username, email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { id: user.id, username, email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}
