// src/components/Sidebar.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiHome, FiBook, FiPlus, FiList, FiSettings, FiLogOut, 
  FiMenu, FiX, FiUser, FiBriefcase, FiCalendar, FiUsers,
  FiEdit, FiEye
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { authApis } from '../services/allApis';

const DashSidebar = ({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab, menuItems, institutionType }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authApis.adminLogout();
    navigate('/login');
  };

  // Default menu items if none provided
  const defaultMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiHome className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <FiUser className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings className="w-5 h-5" /> },
  ];

  const items = menuItems || defaultMenuItems;

  return (
    <>
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-orange-600 text-white rounded-lg"
      >
        {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? '16rem' : '5rem' }}
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl z-40 transition-all duration-300`}
      >
        {/* Logo */}
        <div className={`p-6 border-b border-gray-700 ${!sidebarOpen && 'flex justify-center'}`}>
          {sidebarOpen ? (
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                {institutionType || 'Admin'} Portal
              </h1>
              <p className="text-xs text-gray-400 mt-1">Dashboard</p>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">A</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-8">
          {items.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 transition-colors relative group ${
                activeTab === item.id
                  ? 'bg-orange-600/20 text-orange-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              whileHover={{ x: 5 }}
            >
              <div className="flex items-center justify-center w-6">
                {item.icon}
              </div>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-3 text-sm font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-8 w-full px-4">
          <motion.button
            onClick={handleLogout}
            className={`w-full flex items-center px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors`}
            whileHover={{ x: 5 }}
          >
            <div className="flex items-center justify-center w-6">
              <FiLogOut className="w-5 h-5" />
            </div>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="ml-3 text-sm font-medium"
              >
                Logout
              </motion.span>
            )}
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
};

export default DashSidebar;