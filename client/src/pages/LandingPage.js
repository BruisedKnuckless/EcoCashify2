import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingBag, Leaf, Users, Shield, ArrowRight, Star } from 'lucide-react';

const LandingPage = () => {
  const { user } = useAuth();

  const categories = [
    { name: 'Electronics', icon: '📱', count: 45 },
    { name: 'Fashion', icon: '👕', count: 32 },
    { name: 'Home', icon: '🏠', count: 28 },
    { name: 'Books', icon: '📚', count: 15 },
    { name: 'Other', icon: '🔧', count: 20 }
  ];

  const features = [
    {
      icon: <Leaf className="w-8 h-8 text-primary-600" />,
      title: 'Eco-Friendly',
      description: 'All products are verified for sustainability and environmental impact.'
    },
    {
      icon: <Shield className="w-8 h-8 text-primary-600" />,
      title: 'Secure Trading',
      description: 'Safe and secure transactions with buyer protection.'
    },
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: 'Community Driven',
      description: 'Join a community of environmentally conscious buyers and sellers.'
    }
  ];

  const popularProducts = [
    {
      id: 1,
      title: 'Vintage Wooden Chair',
      price: 89.99,
      category: 'Home',
      image: '/api/placeholder/300/200'
    },
    {
      id: 2,
      title: 'Organic Cotton T-Shirt',
      price: 24.99,
      category: 'Fashion',
      image: '/api/placeholder/300/200'
    },
    {
      id: 3,
      title: 'Solar Phone Charger',
      price: 45.99,
      category: 'Electronics',
      image: '/api/placeholder/300/200'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to{' '}
              <span className="text-primary-600">EcoFinds</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover and sell sustainable, eco-friendly products in our community marketplace. 
              Make a positive impact on the environment while finding great deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="btn-primary text-lg px-8 py-3 inline-flex items-center justify-center"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Browse Products
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="btn-secondary text-lg px-8 py-3 inline-flex items-center justify-center"
                >
                  Join Community
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose EcoFinds?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              We're committed to creating a sustainable marketplace for everyone
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Find exactly what you're looking for
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/products?category=${category.name.toLowerCase()}`}
                className="card p-6 text-center hover:shadow-lg transition-shadow duration-200"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {category.count} items
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Products
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Check out what's trending in our community
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {popularProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="card overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-primary-600 font-medium">
                      {product.category}
                    </span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                        4.8
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {product.title}
                  </h3>
                  <p className="text-2xl font-bold text-primary-600">
                    ${product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="btn-primary text-lg px-8 py-3 inline-flex items-center"
            >
              View All Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 bg-primary-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Trading?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of eco-conscious buyers and sellers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default LandingPage;
