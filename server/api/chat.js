// In-memory data for demo purposes
let chatMessages = [];

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
      
      const userMessages = chatMessages.filter(m => m.user_id === decoded.id);
      res.json(userMessages.slice(-50)); // Return last 50 messages
    } else if (req.method === 'POST') {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: 'Access token required' });
      }

      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      const { message } = req.body;
      
      // Store user message
      const userMessage = {
        id: Date.now(),
        user_id: decoded.id,
        message,
        is_bot: false,
        created_at: new Date().toISOString()
      };
      chatMessages.push(userMessage);
      
      // Generate bot response
      const botResponse = getBotResponse(message);
      
      // Store bot response
      const botMessage = {
        id: Date.now() + 1,
        user_id: decoded.id,
        message: botResponse,
        is_bot: true,
        created_at: new Date().toISOString()
      };
      chatMessages.push(botMessage);
      
      res.json({
        userMessage: message,
        botResponse: botResponse
      });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

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
