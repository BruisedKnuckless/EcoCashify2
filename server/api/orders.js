// In-memory data for demo purposes
let orders = [];

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: 'Access token required' });
      }

      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      const userOrders = orders.filter(o => o.user_id === decoded.id);
      res.json(userOrders);
    } else if (req.method === 'POST') {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: 'Access token required' });
      }

      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      const { product_id, quantity } = req.body;
      
      // Mock product data for pricing
      const mockProducts = {
        1: { price: 89.99, title: 'Vintage Wooden Chair', image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', category_name: 'Home' },
        2: { price: 24.99, title: 'Organic Cotton T-Shirt', image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', category_name: 'Fashion' },
        3: { price: 45.99, title: 'Solar Phone Charger', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', category_name: 'Electronics' },
        4: { price: 19.99, title: 'Sustainable Living Guide', image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', category_name: 'Books' }
      };
      
      const product = mockProducts[product_id];
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      const total_price = product.price * quantity;
      const order = {
        id: orders.length + 1,
        user_id: decoded.id,
        product_id: parseInt(product_id),
        quantity: parseInt(quantity),
        total_price,
        status: 'pending',
        created_at: new Date().toISOString(),
        title: product.title,
        image_url: product.image_url,
        category_name: product.category_name
      };
      
      orders.push(order);
      res.status(201).json({ id: order.id, message: 'Order created successfully' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}
