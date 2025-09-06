// In-memory data for demo purposes
const categories = [
  { id: 1, name: 'Electronics', created_at: new Date().toISOString() },
  { id: 2, name: 'Fashion', created_at: new Date().toISOString() },
  { id: 3, name: 'Home', created_at: new Date().toISOString() },
  { id: 4, name: 'Books', created_at: new Date().toISOString() },
  { id: 5, name: 'Other', created_at: new Date().toISOString() }
];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}
