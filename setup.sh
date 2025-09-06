#!/bin/bash

echo "🌱 Setting up EcoFinds - Sustainable Marketplace Prototype"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

echo ""
echo "🎉 Setup complete! You can now run the application with:"
echo "   npm run dev"
echo ""
echo "This will start both the backend server (port 5000) and frontend (port 3000)"
echo ""
echo "Access the application at: http://localhost:3000"
echo "Backend API available at: http://localhost:5000"
echo ""
echo "Happy coding! 🌱"
