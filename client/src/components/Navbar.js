import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../contexts/CartContext';
import { Sun, Moon, User, LogOut, ShoppingCart, Menu, X } from 'lucide-react';
import Login from '../pages/Login';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSellClick = () => {
    if (!user) {
      setShowLogin(true);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                EcoFinds
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/products" 
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Browse Products
              </Link>
              
              <button
                onClick={handleSellClick}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sell Item
              </button>

              <Link to="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Link>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span>{user.username}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Login</span>
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <Link to="/cart" className="relative p-2">
                <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                {getTotalItems() > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {showMobileMenu && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/products" 
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Browse Products
                </Link>
                
                <button
                  onClick={() => {
                    handleSellClick();
                    setShowMobileMenu(false);
                  }}
                  className="text-left bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sell Item
                </button>

                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>{user.username}</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setShowLogin(true);
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span>Login</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Login Modal */}
      {showLogin && (
        <div className="modal-overlay">
          <div className="modal-content">
            <Login onClose={() => setShowLogin(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
