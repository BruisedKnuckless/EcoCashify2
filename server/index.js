const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Database setup
const db = new sqlite3.Database('./ecofinds.db');

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Categories table
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Products table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category_id INTEGER,
      user_id INTEGER NOT NULL,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories (id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Orders table
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      total_price REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
    )
  `);

  // Chat messages table
  db.run(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      message TEXT NOT NULL,
      is_bot BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Seed categories
  const categories = ['Electronics', 'Fashion', 'Home', 'Books', 'Other'];
  categories.forEach(category => {
    db.run('INSERT OR IGNORE INTO categories (name) VALUES (?)', [category]);
  });

  // Seed sample products
  const sampleProducts = [
    {
      title: 'Vintage Wooden Chair',
      description: 'Beautiful vintage wooden chair, perfect for any home. Made from reclaimed wood.',
      price: 89.99,
      category: 'Home',
      image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
    },
    {
      title: 'Organic Cotton T-Shirt',
      description: '100% organic cotton t-shirt, comfortable and sustainable.',
      price: 24.99,
      category: 'Fashion',
      image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
    },
    {
      title: 'Solar Phone Charger',
      description: 'Portable solar charger for your phone, eco-friendly and efficient.',
      price: 45.99,
      category: 'Electronics',
      image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
    },
    {
      title: 'Sustainable Living Guide',
      description: 'Complete guide to sustainable living practices.',
      price: 19.99,
      category: 'Books',
      image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'
    }
  ];

  // Get category IDs
  db.all('SELECT id, name FROM categories', (err, categories) => {
    if (err) return console.error(err);
    
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    // Insert sample products
    sampleProducts.forEach(product => {
      const categoryId = categoryMap[product.category];
      db.run(
        'INSERT OR IGNORE INTO products (title, description, price, category_id, user_id, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        [product.title, product.description, product.price, categoryId, 1, product.image_url]
      );
    });
  });
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    db.get('SELECT * FROM users WHERE email = ? OR username = ?', [email, username], async (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      db.run(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        function(err) {
          if (err) {
            return res.status(500).json({ message: 'Failed to create user' });
          }

          const token = jwt.sign(
            { id: this.lastID, username, email },
            JWT_SECRET,
            { expiresIn: '7d' }
          );

          res.json({
            token,
            user: { id: this.lastID, username, email }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        token,
        user: { id: user.id, username: user.username, email: user.email }
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Categories routes
app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories ORDER BY name', (err, categories) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(categories);
  });
});

// Products routes
app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  let query = `
    SELECT p.*, c.name as category_name, u.username as seller_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN users u ON p.user_id = u.id
  `;
  const params = [];

  if (category) {
    query += ' WHERE c.name = ?';
    params.push(category);
  }

  if (search) {
    query += category ? ' AND p.title LIKE ?' : ' WHERE p.title LIKE ?';
    params.push(`%${search}%`);
  }

  query += ' ORDER BY p.created_at DESC';

  db.all(query, params, (err, products) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(products);
  });
});

app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  
  db.get(`
    SELECT p.*, c.name as category_name, u.username as seller_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN users u ON p.user_id = u.id
    WHERE p.id = ?
  `, [id], (err, product) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  });
});

app.post('/api/products', authenticateToken, (req, res) => {
  const { title, description, price, category_id, image_url } = req.body;
  
  db.run(
    'INSERT INTO products (title, description, price, category_id, user_id, image_url) VALUES (?, ?, ?, ?, ?, ?)',
    [title, description, price, category_id, req.user.id, image_url],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to create product' });
      }
      res.json({ id: this.lastID, message: 'Product created successfully' });
    }
  );
});

app.put('/api/products/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, description, price, category_id, image_url } = req.body;
  
  db.run(
    'UPDATE products SET title = ?, description = ?, price = ?, category_id = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
    [title, description, price, category_id, image_url, id, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to update product' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Product not found or unauthorized' });
      }
      res.json({ message: 'Product updated successfully' });
    }
  );
});

app.delete('/api/products/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run(
    'DELETE FROM products WHERE id = ? AND user_id = ?',
    [id, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to delete product' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Product not found or unauthorized' });
      }
      res.json({ message: 'Product deleted successfully' });
    }
  );
});

// Orders routes
app.post('/api/orders', authenticateToken, (req, res) => {
  const { product_id, quantity } = req.body;
  
  // Get product price
  db.get('SELECT price FROM products WHERE id = ?', [product_id], (err, product) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const total_price = product.price * quantity;
    
    db.run(
      'INSERT INTO orders (user_id, product_id, quantity, total_price) VALUES (?, ?, ?, ?)',
      [req.user.id, product_id, quantity, total_price],
      function(err) {
        if (err) {
          return res.status(500).json({ message: 'Failed to create order' });
        }
        res.json({ id: this.lastID, message: 'Order created successfully' });
      }
    );
  });
});

app.get('/api/orders', authenticateToken, (req, res) => {
  db.all(`
    SELECT o.*, p.title, p.image_url, c.name as category_name
    FROM orders o
    JOIN products p ON o.product_id = p.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `, [req.user.id], (err, orders) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(orders);
  });
});

// Chat routes
app.post('/api/chat', authenticateToken, (req, res) => {
  const { message } = req.body;
  
  // Store user message
  db.run(
    'INSERT INTO chat_messages (user_id, message, is_bot) VALUES (?, ?, 0)',
    [req.user.id, message],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to store message' });
      }

      // Simple chatbot responses
      const botResponse = getBotResponse(message);
      
      // Store bot response
      db.run(
        'INSERT INTO chat_messages (user_id, message, is_bot) VALUES (?, ?, 1)',
        [req.user.id, botResponse],
        function(err) {
          if (err) {
            return res.status(500).json({ message: 'Failed to store bot response' });
          }
          
          res.json({ 
            userMessage: message,
            botResponse: botResponse
          });
        }
      );
    }
  );
});

app.get('/api/chat', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM chat_messages WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
    [req.user.id],
    (err, messages) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      res.json(messages.reverse());
    }
  );
});

// Simple chatbot logic
function getBotResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('how to list') || lowerMessage.includes('how do i sell')) {
    return "To list a product, go to your dashboard and click 'Add Product'. Fill in the title, description, price, and select a category. Don't forget to add a good image!";
  }
  
  if (lowerMessage.includes('price') || lowerMessage.includes('pricing')) {
    return "When pricing your product, consider the condition, original cost, and market demand. Research similar items to set a competitive price. Remember, our community values fair pricing!";
  }
  
  if (lowerMessage.includes('category') || lowerMessage.includes('categories')) {
    return "We support 5 main categories: Electronics, Fashion, Home, Books, and Other. Choose the category that best fits your product to help buyers find it easily.";
  }
  
  if (lowerMessage.includes('photo') || lowerMessage.includes('image') || lowerMessage.includes('picture')) {
    return "Good photos are crucial for selling! Use natural lighting, show multiple angles, and make sure the item is clean and well-presented. Clear, high-quality images attract more buyers.";
  }
  
  if (lowerMessage.includes('description') || lowerMessage.includes('describe')) {
    return "Write a detailed description including the item's condition, any flaws, dimensions, and why it's eco-friendly. Be honest and specific - buyers appreciate transparency!";
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
    return "I'm here to help with selling questions! You can ask me about listing products, pricing, categories, photos, descriptions, or any other selling-related topics.";
  }
  
  return "I'm a customer service bot focused on helping with selling questions. Ask me about listing products, pricing, categories, or any other selling-related topics!";
}

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
