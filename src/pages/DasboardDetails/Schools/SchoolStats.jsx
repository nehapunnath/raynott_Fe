// src/components/dashboards/SchoolStats.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiBook, FiDollarSign, FiStar, FiCalendar, FiThumbsUp, FiCheckCircle } from 'react-icons/fi';

const SchoolStats = ({ institutionData, registrationStatus }) => {
  const stats = [
    {
      title: 'Total Students',
      value: institutionData?.totalStudents || 'N/A',
      icon: <FiUsers className="w-8 h-8 text-orange-600" />,
      color: 'bg-gradient-to-br from-orange-100 to-orange-50'
    },
    {
      title: 'Total Teachers',
      value: institutionData?.totalTeachers || 'N/A',
      icon: <FiBook className="w-8 h-8 text-blue-600" />,
      color: 'bg-gradient-to-br from-blue-100 to-blue-50'
    },
    {
      title: 'Annual Fee',
      value: institutionData?.totalAnnualFee || 'N/A',
      icon: <FiDollarSign className="w-8 h-8 text-green-600" />,
      color: 'bg-gradient-to-br from-green-100 to-green-50'
    },
    {
      title: 'Rating',
      value: institutionData?.rating || 'Not Rated',
      icon: <FiStar className="w-8 h-8 text-yellow-600" />,
      color: 'bg-gradient-to-br from-yellow-100 to-yellow-50'
    },
    {
      title: 'Established',
      value: institutionData?.establishmentYear || 'N/A',
      icon: <FiCalendar className="w-8 h-8 text-purple-600" />,
      color: 'bg-gradient-to-br from-purple-100 to-purple-50'
    },
    {
      title: 'Reviews',
      value: institutionData?.reviews?.length || 0,
      icon: <FiThumbsUp className="w-8 h-8 text-red-600" />,
      color: 'bg-gradient-to-br from-red-100 to-red-50'
    }
  ];

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {institutionData?.name || 'Institution'}!</p>
          </div>
          {registrationStatus === 'approved' && (
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full flex items-center space-x-2">
              <FiCheckCircle className="w-5 h-5" />
              <span className="font-medium">Verified Institution</span>
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.color} rounded-xl shadow-lg p-6 border border-gray-100`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className="p-3 bg-white rounded-full shadow-md">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-600 text-white rounded-lg p-4 hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
            <FiUsers className="w-5 h-5" />
            <span>Manage Enquiries</span>
          </button>
          <button className="bg-green-600 text-white rounded-lg p-4 hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
            <FiStar className="w-5 h-5" />
            <span>View Reviews</span>
          </button>
          <button className="bg-purple-600 text-white rounded-lg p-4 hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
            <FiBook className="w-5 h-5" />
            <span>Update Profile</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SchoolStats;