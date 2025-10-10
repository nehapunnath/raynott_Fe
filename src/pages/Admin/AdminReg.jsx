import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaCheck, FaTimes, FaEye, FaSpinner, FaSearch, FaFilter, FaHome, FaClipboardList
} from 'react-icons/fa';
import { registerApi } from '../../services/RegisterApi';
import { useNavigate } from 'react-router-dom';

const AdminReg = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'all'
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRegistrations();
  }, [activeTab]);

  const fetchRegistrations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = activeTab === 'pending'
        ? await registerApi.getPendingRegistrations()
        : await registerApi.getAllRegistrations();
      setRegistrations(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setLoading(true);
      const response = await registerApi.approveRegistration(id);
      setRegistrations(registrations.map(reg =>
        reg.id === id ? { ...reg, status: 'approved' } : reg
      ));
      alert('Registration approved successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    try {
      setLoading(true);
      const response = await registerApi.rejectRegistration(id);
      setRegistrations(registrations.map(reg =>
        reg.id === id ? { ...reg, status: 'rejected' } : reg
      ));
      alert('Registration rejected successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/admin/registrations/${id}`);
  };

  const filteredRegistrations = registrations.filter(reg =>
    (reg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     reg.institutionType?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (activeTab === 'pending' ? reg.status === 'pending' : true)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back to Dashboard */}
        {/* <motion.button
          onClick={() => navigate('/admin/dashboard')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition mb-6"
        >
          <FaHome className="text-xl" />
          <span className="font-medium">Back to Dashboard</span>
        </motion.button> */}

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FaClipboardList className="mr-2 text-orange-600" />
            Admin Registrations
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-2 font-medium ${activeTab === 'pending' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Pending ({registrations.filter(reg => reg.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2 font-medium ${activeTab === 'all' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            All ({registrations.length})
          </button>
        </div>

        {/* Search and Refresh */}
        <div className="flex justify-between mb-6">
          {/* <div className="relative w-full max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div> */}
          <motion.button
            onClick={fetchRegistrations}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center"
            disabled={loading}
          >
            <FaFilter className="mr-2" /> Refresh
          </motion.button>
        </div>

        {/* Table */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="animate-spin text-4xl text-orange-600" />
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted On</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No {activeTab === 'pending' ? 'pending' : ''} registrations found.
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <tr key={reg.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reg.name || reg.teacherName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{reg.institutionType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.email || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            reg.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : reg.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(reg.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <motion.button
                            onClick={() => handleViewDetails(reg.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Details"
                          >
                            <FaEye />
                          </motion.button>
                          {reg.status !== 'approved' && (
                            <motion.button
                            //   onClick={() => handleApprove(reg.id)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-green-600 hover:text-green-800"
                              title="Approve"
                              disabled={loading}
                            >
                              <FaCheck />
                            </motion.button>
                          )}
                          {reg.status !== 'rejected' && (
                            <motion.button
                            //   onClick={() => handleReject(reg.id)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-red-600 hover:text-red-800"
                              title="Reject"
                              disabled={loading}
                            >
                              <FaTimes />
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReg;