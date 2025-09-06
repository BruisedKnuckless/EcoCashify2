// In-memory data for demo purposes
let products = [
  {
    id: 1,
    title: 'Vintage Wooden Chair',
    description: 'Beautiful vintage wooden chair, perfect for any home. Made from reclaimed wood.',
    price: 89.99,
    category_id: 3,
    user_id: 1,
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    created_at: new Date().toISOString(),
    category_name: 'Home',
    seller_name: 'demo'
  },
  {
    id: 2,
    title: 'Organic Cotton T-Shirt',
    description: '100% organic cotton t-shirt, comfortable and sustainable.',
    price: 24.99,
    category_id: 2,
    user_id: 1,
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    created_at: new Date().toISOString(),
    category_name: 'Fashion',
    seller_name: 'demo'
  },
  {
    id: 3,
    title: 'Solar Phone Charger',
    description: 'Portable solar charger for your phone, eco-friendly and efficient.',
    price: 45.99,
    category_id: 1,
    user_id: 1,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    created_at: new Date().toISOString(),
    category_name: 'Electronics',
    seller_name: 'demo'
  },
  {
    id: 4,
    title: 'Sustainable Living Guide',
    description: 'Complete guide to sustainable living practices.',
    price: 19.99,
    category_id: 4,
    user_id: 1,
    image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    created_at: new Date().toISOString(),
    category_name: 'Books',
    seller_name: 'demo'
  }
];

export default async function handler(req, res) {
  const { id } = req.query;
  
  try {
    if (req.method === 'GET') {
      const product = products.find(p => p.id === parseInt(id));
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } else if (req.method === 'PUT') {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: 'Access token required' });
      }

      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      const productIndex = products.findIndex(p => p.id === parseInt(id));
      if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      const product = products[productIndex];
      if (product.user_id !== decoded.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      const { title, description, price, category_id, image_url } = req.body;
      products[productIndex] = {
        ...product,
        title,
        description,
        price: parseFloat(price),
        category_id: parseInt(category_id),
        image_url: image_url || product.image_url,
        category_name: getCategoryName(category_id)
      };
      
      res.json({ message: 'Product updated successfully' });
    } else if (req.method === 'DELETE') {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: 'Access token required' });
      }

      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      const productIndex = products.findIndex(p => p.id === parseInt(id));
      if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      const product = products[productIndex];
      if (product.user_id !== decoded.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      products.splice(productIndex, 1);
      res.json({ message: 'Product deleted successfully' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

function getCategoryName(categoryId) {
  const categories = {
    1: 'Electronics',
    2: 'Fashion', 
    3: 'Home',
    4: 'Books',
    5: 'Other'
  };
  return categories[categoryId] || 'Other';
}
