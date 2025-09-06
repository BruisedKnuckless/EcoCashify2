import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { ArrowLeft, ShoppingCart, Star, User, Calendar, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/products/${id}`);
      navigate('/products');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const isOwner = user && product && user.id === product.user_id;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Product not found
          </h2>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="card overflow-hidden">
            <img
              src={product.image_url || '/api/placeholder/600/400'}
              alt={product.title}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-primary-600 font-medium">
                  {product.category_name}
                </span>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                    4.8 (24 reviews)
                  </span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {product.title}
              </h1>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>by {product.seller_name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(product.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description || 'No description provided.'}
              </p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-4xl font-bold text-primary-600">
                  ${product.price}
                </span>
                
                {isOwner && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/dashboard?edit=${product.id}`)}
                      className="btn-secondary flex items-center space-x-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-1 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>

              {!isOwner && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Quantity
                    </label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="input-field w-20"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    onClick={handleAddToCart}
                    className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Eco-Friendly
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              This product has been verified for its environmental impact and sustainability.
            </p>
          </div>
          
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Secure Payment
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              All transactions are protected with our secure payment system.
            </p>
          </div>
          
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Community Verified
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              This seller is a trusted member of our eco-conscious community.
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="card p-6 max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Delete Product
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
