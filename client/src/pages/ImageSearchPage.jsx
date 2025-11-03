// src/pages/ImageSearchPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiLogOut, 
  FiUser, 
  FiMoon, 
  FiSun,
  FiClock,
  FiX,
  FiCheck
} from 'react-icons/fi';

const API = axios.create({ baseURL: 'http://localhost:4081' });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function ImageSearchPage() {
  const [term, setTerm] = useState('');
  const [images, setImages] = useState([]);
  const [topSearches, setTopSearches] = useState([]);
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTop();
    fetchHistory();
    // Check system preference for dark mode
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  async function fetchTop() {
    try {
      const res = await API.get('/api/top-searches');
      setTopSearches(res.data);
    } catch (e) { console.error(e); }
  }

  async function fetchHistory() {
    try {
      const res = await API.get('/api/history');
      setHistory(res.data);
    } catch (e) { console.error(e); }
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!term.trim()) return;
    
    setIsLoading(true);
    try {
      const res = await API.post('/api/search', { term });
      console.log("Search Response:", res.data);
      console.log("Search Response:", res.data);

      setImages(res.data.images);
      // fetchTop();
      // fetchHistory();
      setSelected(new Set());
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function toggleSelect(id) {
    setSelected(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  }

  function handleLogout() {
    localStorage.removeItem('token');
    window.location.reload();
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      {/* Navbar */}
      <nav className={`backdrop-blur-lg border-b ${
        isDark 
          ? 'bg-black/30 border-gray-800' 
          : 'bg-white/30 border-gray-200'
      } transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              ImageSearch Pro
            </motion.h1>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-full ${
                  isDark 
                    ? 'bg-gray-800 text-yellow-300' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
              </motion.button>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-full ${
                  isDark ? 'bg-gray-800' : 'bg-white/50'
                }`}
              >
                <FiUser className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                <span className={isDark ? 'text-white' : 'text-gray-900'}>
                  User
                </span>
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  isDark 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                } transition-colors`}
              >
                <FiLogOut size={16} />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Selected Counter Badge */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`fixed top-24 right-6 z-50 px-4 py-2 rounded-full shadow-lg ${
              isDark 
                ? 'bg-purple-600 text-white' 
                : 'bg-purple-500 text-white'
            }`}
          >
            <span className="font-semibold">{selected.size} selected</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Top Searches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-8 p-6 rounded-2xl backdrop-blur-lg ${
                isDark ? 'bg-black/30' : 'bg-white/30'
              } border ${
                isDark ? 'border-gray-800' : 'border-white/50'
              }`}
            >
              <h2 className={`text-lg font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Trending Searches
              </h2>
              <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
                {topSearches.map((t, index) => (

                  
                  <motion.button
                    key={t.term}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTerm(t.term)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                      isDark
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                    } transition-colors`}
                  >
                    {t.term} ({t.count})
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Search Form */}
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSearch}
              className="relative mb-8"
            >
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  value={term}
                  onChange={e => setTerm(e.target.value)}
                  placeholder="Search for images..."
                  className={`w-full px-6 py-4 text-lg rounded-2xl backdrop-blur-lg border-2 focus:outline-none focus:border-purple-500 transition-all ${
                    isDark
                      ? 'bg-black/30 border-gray-700 text-white placeholder-gray-400'
                      : 'bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isLoading}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-3 rounded-xl ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : isDark
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-purple-500 hover:bg-purple-600'
                  } text-white transition-colors`}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <FiSearch size={20} />
                  )}
                </motion.button>
              </div>
            </motion.form>

            {/* Image Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            >
              <AnimatePresence>
                {images.map((img) => (
                  <motion.div
                    key={img.id}
                    variants={itemVariants}
                    layout
                    className={`relative group cursor-pointer rounded-2xl overflow-hidden ${
                      selected.has(img.id) 
                        ? 'ring-4 ring-purple-500 transform scale-105' 
                        : ''
                    } transition-all duration-300`}
                  >
                    <motion.img
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      src={img.thumb}
                      alt={img.alt}
                      className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    
                    {/* Glassmorphic Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      isDark ? 'backdrop-blur-sm' : 'backdrop-blur-xs'
                    }`} />
                    
                    {/* Animated Checkbox */}
                    <motion.label
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                        selected.has(img.id)
                          ? 'bg-purple-500 text-white'
                          : isDark
                          ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80'
                          : 'bg-white/80 text-gray-600 hover:bg-white'
                      } backdrop-blur-sm`}
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(img.id)}
                        onChange={() => toggleSelect(img.id)}
                        className="hidden"
                      />
                      <AnimatePresence mode="wait">
                        {selected.has(img.id) ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <FiCheck size={16} />
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <FiX size={16} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.label>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {images.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-center py-16 rounded-2xl ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                <FiSearch size={64} className="mx-auto mb-4 opacity-50" />
                <p className="text-xl">Search for images to get started</p>
              </motion.div>
            )}
          </div>

          {/* History Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`lg:w-80 rounded-2xl backdrop-blur-lg p-6 h-fit ${
              isDark ? 'bg-black/30 border-gray-800' : 'bg-white/30 border-white/50'
            } border`}
          >
            <div className="flex items-center space-x-2 mb-6">
              <FiClock className={isDark ? 'text-purple-400' : 'text-purple-600'} />
              <h3 className={`text-lg font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Search History
              </h3>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
              {history.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 4 }}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    isDark 
                      ? 'bg-gray-800/50 hover:bg-gray-700/50' 
                      : 'bg-white/50 hover:bg-white/70'
                  } border ${
                    isDark ? 'border-gray-700' : 'border-white'
                  }`}
                  onClick={() => setTerm(h.term)}
                >
                  <div className={`font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {h.term}
                  </div>
                  <div className={`text-sm mt-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {new Date(h.timestamp).toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {history.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-center py-8 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                No search history yet
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}