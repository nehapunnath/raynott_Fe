// src/components/dashboards/RegistrationStatus.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiCheckCircle, FiXCircle, FiRefreshCw, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { FaSchool, FaUniversity, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';

const RegistrationStatus = ({ status, registrationData, onRegister }) => {
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleRegister = () => {
    setIsRedirecting(true);
    navigate('/register-form');
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <FiClock className="w-16 h-16 text-yellow-500" />;
      case 'approved':
        return <FiCheckCircle className="w-16 h-16 text-green-500" />;
      case 'rejected':
        return <FiXCircle className="w-16 h-16 text-red-500" />;
      default:
        return <FaSchool className="w-16 h-16 text-orange-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'from-yellow-500 to-yellow-600';
      case 'approved':
        return 'from-green-500 to-green-600';
      case 'rejected':
        return 'from-red-500 to-red-600';
      default:
        return 'from-orange-500 to-amber-600';
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'pending':
        return 'Registration Under Review';
      case 'approved':
        return 'Registration Approved!';
      case 'rejected':
        return 'Registration Rejected';
      default:
        return 'Complete Your Registration';
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'pending':
        return `Your registration has been submitted successfully and is currently under review by our admin team. 
                This process typically takes 2-3 business days. You will be notified once your registration is approved.`;
      case 'approved':
        return 'Congratulations! Your institution has been approved. You can now manage your profile and reach more students.';
      case 'rejected':
        return `Your registration was rejected. Reason: ${registrationData?.rejectionReason || 'Please contact support for more information.'}
                Please review the requirements and submit a new registration.`;
      default:
        return 'Get started by registering your institution on our platform. Once approved, your institution will be visible to students and parents.';
    }
  };

  const getInstitutionTypeIcon = (type) => {
    switch (type) {
      case 'school':
        return <FaSchool className="w-5 h-5" />;
      case 'college':
        return <FaUniversity className="w-5 h-5" />;
      case 'coaching':
        return <FaChalkboardTeacher className="w-5 h-5" />;
      case 'teacher':
        return <FaUserGraduate className="w-5 h-5" />;
      default:
        return <FaSchool className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className={`bg-gradient-to-r ${getStatusColor()} text-white py-8 px-6 text-center`}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="flex justify-center mb-4"
            >
              {getStatusIcon()}
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">{getStatusTitle()}</h1>
            {registrationData?.submittedAt && (
              <p className="text-white/90">
                Submitted on: {new Date(registrationData.submittedAt).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="mb-8">
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                {getStatusMessage()}
              </p>
            </div>

            {/* Registration Details (for pending/rejected) */}
            {registrationData && status !== 'approved' && (
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Registration Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Institution Type</p>
                    <p className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                      {getInstitutionTypeIcon(registrationData.institutionType)}
                      {registrationData.institutionType?.charAt(0).toUpperCase() + registrationData.institutionType?.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className={`font-medium mt-1 flex items-center gap-2 ${
                      status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {status === 'pending' ? <FiClock className="w-4 h-4" /> : <FiXCircle className="w-4 h-4" />}
                      {status === 'pending' ? 'Pending Approval' : 'Rejected'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Submission ID</p>
                    <p className="font-mono text-sm text-gray-800 mt-1">{registrationData.id}</p>
                  </div>
                  {status === 'rejected' && registrationData.rejectedAt && (
                    <div>
                      <p className="text-sm text-gray-500">Rejected On</p>
                      <p className="font-medium text-gray-800 mt-1">
                        {new Date(registrationData.rejectedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {status === 'not_registered' && (
                <motion.button
                  onClick={handleRegister}
                  disabled={isRedirecting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                >
                  <span>{isRedirecting ? 'Redirecting...' : 'Register Now'}</span>
                  {!isRedirecting && <FiArrowRight className="w-5 h-5" />}
                </motion.button>
              )}

              {status === 'rejected' && (
                <motion.button
                  onClick={handleRegister}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                >
                  <FiRefreshCw className="w-5 h-5" />
                  <span>Submit New Registration</span>
                </motion.button>
              )}

              {status === 'pending' && (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    You will receive an email notification once your registration is reviewed.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>What happens next?</strong><br />
                      1. Our admin team will review your application<br />
                      2. You'll receive an email with the decision<br />
                      3. Once approved, you can manage your profile from the dashboard
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Help Section */}
            {(status === 'pending' || status === 'rejected') && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Need Help?</h3>
                <p className="text-gray-600">
                  Contact our support team at <a href="mailto:support@example.com" className="text-orange-600 hover:underline">support@example.com</a> 
                  {' '}or call us at <a href="tel:+919876543210" className="text-orange-600 hover:underline">+91 98765 43210</a>
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegistrationStatus;