import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Search, Filter, Plus, ShoppingCart, Star } from 'lucide-react';
import axios from 'axios';

const Products = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      
      const response = await axios.get(`/api/products?${params}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory]);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Browse Products
          </h1>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="card p-4 mb-6">
              <div className="flex flex-wrap gap-4 items-center">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={clearFilters}
                  className="btn-secondary mt-6"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Results count */}
          <p className="text-gray-600 dark:text-gray-400">
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <ShoppingCart className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search or filters
            </p>
            {user && (
              <Link
                to="/dashboard"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Product</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="card overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <Link to={`/product/${product.id}`}>
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700">
                    <img
                      src={product.image_url || '/api/placeholder/300/200'}
                      alt={product.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </Link>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-primary-600 font-medium">
                      {product.category_name}
                    </span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                        4.8
                      </span>
                    </div>
                  </div>
                  
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      {product.title}
                    </h3>
                  </Link>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary-600">
                      ${product.price}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="btn-primary flex items-center space-x-1"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    by {product.seller_name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Product CTA for logged in users */}
        {user && products.length > 0 && (
          <div className="text-center mt-12">
            <Link
              to="/dashboard"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your Product</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
