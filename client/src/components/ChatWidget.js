import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import axios from 'axios';

const ChatWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user && isOpen) {
      fetchMessages();
    }
  }, [user, isOpen]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/api/chat');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    const userMessage = newMessage.trim();
    setNewMessage('');
    setLoading(true);

    // Add user message to UI immediately
    const tempUserMessage = {
      id: Date.now(),
      message: userMessage,
      is_bot: false,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      const response = await axios.post('/api/chat', { message: userMessage });
      
      // Replace temp message with actual response
      setMessages(prev => [
        ...prev.filter(msg => msg.id !== tempUserMessage.id),
        {
          id: Date.now() + 1,
          message: response.data.userMessage,
          is_bot: false,
          created_at: new Date().toISOString()
        },
        {
          id: Date.now() + 2,
          message: response.data.botResponse,
          is_bot: true,
          created_at: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove temp message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempUserMessage.id));
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!user) return null;

  return (
    <div className="chat-widget">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg transition-colors"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-80 h-96 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Customer Service
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400">
                <Bot className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">
                  Hi! I'm here to help with selling questions. Ask me about:
                </p>
                <ul className="text-xs mt-2 space-y-1">
                  <li>• How to list products</li>
                  <li>• Pricing strategies</li>
                  <li>• Categories</li>
                  <li>• Photos & descriptions</li>
                </ul>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.is_bot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg ${
                      message.is_bot
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'bg-primary-600 text-white'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.is_bot ? (
                        <Bot className="w-4 h-4 mt-0.5 text-primary-600" />
                      ) : (
                        <User className="w-4 h-4 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.is_bot 
                            ? 'text-gray-500 dark:text-gray-400' 
                            : 'text-primary-100'
                        }`}>
                          {formatTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-primary-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask about selling..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || loading}
                className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
