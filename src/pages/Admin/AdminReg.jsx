import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaCheck, FaTimes, FaEye, FaSpinner, FaSearch, FaFilter, FaHome, FaClipboardList,
  FaSchool, FaUniversity, FaChalkboardTeacher, FaUserGraduate, FaClock, FaCheckCircle, FaTimesCircle
} from 'react-icons/fa';
import { registerApi } from '../../services/RegisterApi';
import { useNavigate } from 'react-router-dom';

const AdminReg = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processingId, setProcessingId] = useState(null);

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
      
      // Handle different response formats
      let registrationsData = [];
      if (response.data && Array.isArray(response.data)) {
        registrationsData = response.data;
      } else if (Array.isArray(response)) {
        registrationsData = response;
      } else if (response.registrations && Array.isArray(response.registrations)) {
        registrationsData = response.registrations;
      }
      
      setRegistrations(registrationsData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Are you sure you want to approve this registration?')) return;
    
    setProcessingId(id);
    try {
      await registerApi.approveRegistration(id, 'Approved by admin');
      await fetchRegistrations();
      alert('Registration approved successfully!');
    } catch (err) {
      setError(err.message);
      alert('Failed to approve registration: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    setProcessingId(id);
    try {
      await registerApi.rejectRegistration(id, rejectReason, 'Rejected by admin');
      setShowRejectModal(null);
      setRejectReason('');
      await fetchRegistrations();
      alert('Registration rejected successfully!');
    } catch (err) {
      setError(err.message);
      alert('Failed to reject registration: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/admin/registrations/${id}`);
  };

  const getInstitutionIcon = (type) => {
    switch (type) {
      case 'school': return <FaSchool className="text-orange-600" />;
      case 'college': return <FaUniversity className="text-blue-600" />;
      case 'pu_college': return <FaUniversity className="text-purple-600" />;
      case 'coaching': return <FaChalkboardTeacher className="text-green-600" />;
      case 'teacher': return <FaUserGraduate className="text-pink-600" />;
      default: return <FaSchool className="text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800', icon: <FaClock className="mr-1" />, text: 'Pending' };
      case 'approved':
        return { color: 'bg-green-100 text-green-800', icon: <FaCheckCircle className="mr-1" />, text: 'Approved' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-800', icon: <FaTimesCircle className="mr-1" />, text: 'Rejected' };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: null, text: status };
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (reg.name?.toLowerCase().includes(searchLower) ||
       reg.teacherName?.toLowerCase().includes(searchLower) ||
       reg.institutionType?.toLowerCase().includes(searchLower) ||
       reg.email?.toLowerCase().includes(searchLower) ||
       reg.phone?.includes(searchTerm)) &&
      (activeTab === 'pending' ? reg.status === 'pending' : true)
    );
  });

  const pendingCount = registrations.filter(reg => reg.status === 'pending').length;
  const approvedCount = registrations.filter(reg => reg.status === 'approved').length;
  const rejectedCount = registrations.filter(reg => reg.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FaClipboardList className="mr-3 text-orange-600" />
            Registration Management
          </h1>
          <p className="text-gray-600 mt-2">Manage and review institution registration requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Approvals</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <FaClock className="text-4xl text-yellow-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Approved</p>
                <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <FaCheckCircle className="text-4xl text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
              </div>
              <FaTimesCircle className="text-4xl text-red-400" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Tabs and Search */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="border-b border-gray-200 px-6 pt-4">
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex space-x-6">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`pb-3 px-2 font-medium transition-colors ${
                    activeTab === 'pending'
                      ? 'border-b-2 border-orange-600 text-orange-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Pending Requests
                  {pendingCount > 0 && (
                    <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`pb-3 px-2 font-medium transition-colors ${
                    activeTab === 'all'
                      ? 'border-b-2 border-orange-600 text-orange-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  All Registrations
                </button>
              </div>
              
              <div className="flex space-x-3 pb-3">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
                  />
                </div>
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
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-4xl text-orange-600" />
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        <div className="text-4xl mb-2">📋</div>
                        No {activeTab === 'pending' ? 'pending' : ''} registrations found
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((reg) => {
                      const statusBadge = getStatusBadge(reg.status);
                      return (
                        <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="mr-3">
                                {getInstitutionIcon(reg.institutionType)}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {reg.name || reg.teacherName || 'N/A'}
                                </div>
                                {reg.city && (
                                  <div className="text-xs text-gray-500">{reg.city}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900 capitalize">
                              {reg.institutionType?.replace('_', ' ') || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{reg.email || reg.contactEmail || '-'}</div>
                            <div className="text-xs text-gray-500">{reg.phone || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${statusBadge.color}`}>
                              {statusBadge.icon}
                              {statusBadge.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {reg.submittedAt || reg.createdAt ? new Date(reg.submittedAt || reg.createdAt).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-3">
                              <motion.button
                                onClick={() => handleViewDetails(reg.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-blue-600 hover:text-blue-800"
                                title="View Details"
                              >
                                <FaEye className="w-5 h-5" />
                              </motion.button>
                              
                              {reg.status === 'pending' && (
                                <>
                                  <motion.button
                                    onClick={() => handleApprove(reg.id)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="text-green-600 hover:text-green-800"
                                    title="Approve"
                                    disabled={processingId === reg.id}
                                  >
                                    {processingId === reg.id ? (
                                      <FaSpinner className="animate-spin w-5 h-5" />
                                    ) : (
                                      <FaCheck className="w-5 h-5" />
                                    )}
                                  </motion.button>
                                  
                                  <motion.button
                                    onClick={() => setShowRejectModal(reg.id)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="text-red-600 hover:text-red-800"
                                    title="Reject"
                                  >
                                    <FaTimes className="w-5 h-5" />
                                  </motion.button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Reject Registration</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for rejecting this registration:</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
              rows="4"
              placeholder="Enter rejection reason..."
            />
            <div className="flex space-x-3">
              <button
                onClick={() => handleReject(showRejectModal)}
                disabled={processingId === showRejectModal}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {processingId === showRejectModal ? <FaSpinner className="animate-spin mx-auto" /> : 'Confirm Reject'}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectReason('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminReg;