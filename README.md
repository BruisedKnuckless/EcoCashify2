# EcoFinds - Sustainable Marketplace Prototype

A full-stack prototype of an eco-friendly marketplace built with React, Node.js, and SQLite. Features user authentication, product management, shopping cart, and AI-powered customer service chatbot.

## Features

### 🔐 Authentication
- User registration and login with JWT
- Auto-open login modal when trying to sell without authentication
- Secure password hashing with bcrypt

### 🏠 Landing Page
- Responsive design with dark mode toggle
- Category preview and popular products
- Welcome banner and platform introduction

### 🛍️ Product Management
- Full CRUD operations for products
- Category-based organization (Electronics, Fashion, Home, Books, Other)
- Image support with placeholder fallbacks
- Product search and filtering

### 🛒 Shopping Experience
- Add products to cart
- Quantity management
- Secure checkout process
- Purchase history tracking

### 💬 Chat System
- Direct company chat widget
- AI-powered customer service chatbot
- Selling-focused assistance (pricing, categories, descriptions)

### 🎨 UI/UX
- Responsive design for mobile and desktop
- Dark mode support with persistent theme
- Modern UI with TailwindCSS
- Smooth animations and transitions

## Tech Stack

### Frontend
- **React 18** - UI framework
- **TailwindCSS** - Styling and responsive design
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecofinds
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Manual Setup (Alternative)

If you prefer to set up each part separately:

1. **Backend Setup**
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Frontend Setup** (in a new terminal)
   ```bash
   cd client
   npm install
   npm start
   ```

## Project Structure

```
ecofinds/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts (Auth, Theme, Cart)
│   │   ├── pages/          # Page components
│   │   └── App.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── index.js           # Main server file
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### Products
- `GET /api/products` - Get all products (with search/filter)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (authenticated)
- `PUT /api/products/:id` - Update product (authenticated)
- `DELETE /api/products/:id` - Delete product (authenticated)

### Categories
- `GET /api/categories` - Get all categories

### Orders
- `GET /api/orders` - Get user orders (authenticated)
- `POST /api/orders` - Create order (authenticated)

### Chat
- `GET /api/chat` - Get chat history (authenticated)
- `POST /api/chat` - Send message (authenticated)

## Database Schema

### Users
- id, username, email, password, created_at

### Categories
- id, name, created_at

### Products
- id, title, description, price, category_id, user_id, image_url, created_at, updated_at

### Orders
- id, user_id, product_id, quantity, total_price, status, created_at

### Chat Messages
- id, user_id, message, is_bot, created_at

## Features in Detail

### Dark Mode
- Toggle button in navbar
- Persistent across sessions
- Smooth transitions

### Product Management
- Create, read, update, delete products
- Category selection
- Image URL support
- Price validation

### Shopping Cart
- Add/remove items
- Quantity management
- Persistent storage
- Checkout process

### Chatbot
- AI-powered responses
- Selling-focused assistance
- Real-time messaging
- Message history

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced search filters
- [ ] Product reviews and ratings
- [ ] Payment integration
- [ ] Image upload functionality
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Mobile app
- [ ] Social features

## Support

For support or questions, please open an issue in the repository.
