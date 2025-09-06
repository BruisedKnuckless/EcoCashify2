// Simple test script to verify API endpoints work
const axios = require('axios');

const BASE_URL = 'http://localhost:5000'; // Change to your Vercel URL when deployed

async function testAPI() {
  console.log('🧪 Testing EcoFinds API...\n');

  try {
    // Test categories endpoint
    console.log('1. Testing categories endpoint...');
    const categoriesResponse = await axios.get(`${BASE_URL}/api/categories`);
    console.log('✅ Categories:', categoriesResponse.data.length, 'categories found');

    // Test products endpoint
    console.log('\n2. Testing products endpoint...');
    const productsResponse = await axios.get(`${BASE_URL}/api/products`);
    console.log('✅ Products:', productsResponse.data.length, 'products found');

    // Test user registration
    console.log('\n3. Testing user registration...');
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpassword123'
    });
    console.log('✅ Registration successful:', registerResponse.data.user.username);

    // Test user login
    console.log('\n4. Testing user login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'test@example.com',
      password: 'testpassword123'
    });
    console.log('✅ Login successful:', loginResponse.data.user.username);

    // Test product creation
    console.log('\n5. Testing product creation...');
    const token = loginResponse.data.token;
    const productResponse = await axios.post(`${BASE_URL}/api/products`, {
      title: 'Test Product',
      description: 'A test product for API testing',
      price: 29.99,
      category_id: 1,
      image_url: 'https://via.placeholder.com/300x200'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Product created with ID:', productResponse.data.id);

    // Test chat
    console.log('\n6. Testing chat functionality...');
    const chatResponse = await axios.post(`${BASE_URL}/api/chat`, {
      message: 'How do I list a product?'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Chat response:', chatResponse.data.botResponse.substring(0, 50) + '...');

    console.log('\n🎉 All tests passed! API is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    console.error('Status:', error.response?.status);
  }
}

// Run tests
testAPI();
