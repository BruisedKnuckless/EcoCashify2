import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

const ProductForm = ({ product, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category_id: '',
    image_url: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price || '',
        category_id: product.category_id || '',
        image_url: product.image_url || ''
      });
    }
  }, [product]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (product) {
        // Update existing product
        await axios.put(`/api/products/${product.id}`, formData);
      } else {
        // Create new product
        await axios.post('/api/products', formData);
      }
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Product Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Enter product title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="input-field"
              placeholder="Describe your product..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="input-field"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category *
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image URL
            </label>
            <div className="flex space-x-2">
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="input-field flex-1"
                placeholder="https://example.com/image.jpg"
              />
              <button
                type="button"
                className="btn-secondary flex items-center space-x-2"
                onClick={() => {
                  const url = prompt('Enter image URL:');
                  if (url) {
                    setFormData({ ...formData, image_url: url });
                  }
                }}
              >
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </button>
            </div>
            {formData.image_url && (
              <div className="mt-2">
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-32 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
              Eco-Friendly Tips
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              <li>• Use natural lighting for photos</li>
              <li>• Mention any eco-friendly features</li>
              <li>• Be honest about the item's condition</li>
              <li>• Consider the environmental impact of shipping</li>
            </ul>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary py-3 px-6"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
