import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Package, ShoppingBag, User, Settings } from 'lucide-react';
import axios from 'axios';
import ProductForm from '../components/ProductForm';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchUserProducts();
    fetchUserOrders();
    
    // Check if editing a product
    const editId = searchParams.get('edit');
    if (editId) {
      setEditingProduct(parseInt(editId));
      setShowProductForm(true);
    }
  }, [user, navigate, searchParams]);

  const fetchUserProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      const userProducts = response.data.filter(product => product.user_id === user.id);
      setProducts(userProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${productId}`);
        fetchUserProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleProductFormClose = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    fetchUserProducts();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user.username}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your products and track your sales
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <Package className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  My Products
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {products.length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {orders.length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Member Since
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Date(user.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Products
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Purchase History
              </button>
            </nav>
          </div>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                My Products
              </h2>
              <button
                onClick={() => setShowProductForm(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Product</span>
              </button>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-600 mb-4">
                  <Package className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No products yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Start selling by adding your first product
                </p>
                <button
                  onClick={() => setShowProductForm(true)}
                  className="btn-primary"
                >
                  Add Your First Product
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="card overflow-hidden">
                    <img
                      src={product.image_url || '/api/placeholder/300/200'}
                      alt={product.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {product.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {product.category_name}
                      </p>
                      <p className="text-lg font-bold text-primary-600 mb-4">
                        ${product.price}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="btn-secondary flex items-center space-x-1 flex-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="btn-secondary flex items-center space-x-1"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg flex items-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Purchase History
            </h2>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-600 mb-4">
                  <ShoppingBag className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No purchases yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Start shopping to see your purchase history here
                </p>
                <button
                  onClick={() => navigate('/products')}
                  className="btn-primary"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="card p-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={order.image_url || '/api/placeholder/80/80'}
                        alt={order.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {order.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.category_name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Quantity: {order.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary-600">
                          ${order.total_price}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          order.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ProductForm
              product={editingProduct}
              onClose={handleProductFormClose}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
