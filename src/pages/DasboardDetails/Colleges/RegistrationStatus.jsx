import React, { useState } from 'react'
import { motion } from 'framer-motion';
import { FaChalkboardTeacher, FaSchool, FaUniversity, FaUserGraduate } from 'react-icons/fa';
import { FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';


const RegistrationStatus=({status,registrationData,onRegister})=>{
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
    <div className='min-h-screen bg-gradient-to-b from-orange-50 to-white p-6'>
      <div className='max-w-4xl mx-auto'>
      <motion.div
      initial={{ opacity:0 , y:20}}
      animate={{ opacity:1 , y:0}}
      className ="bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className={`bg-gradient-to-r ${getStatusColor()} text-white py-8 px-6 text-center`}>
          <motion.div
          initial={{scale :0}}
          animate={{scale:1}}
          transition={{type:"spring",stiffness:200 , damping:20}}
          className="flex justify-center mb-4"
          >
            {getStatusIcon()}
          </motion.div>
          <h1 className="text-3xl ont-bold mb-2">{getStatusIcon()}</h1>
          {registrationData?.submittedAt && (
            <p className="text-white/90">
              Submitted on: {new Date(registrationData.submittedAt).toLocaleDateString()}
            </p>
          )}
          <div className="p-8">
            <div className="mb-8">
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                {getStatusMessage()}
              </p>

            </div>
          </div>

          {registrationData && status !== 'approved' && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold tex-gray-800 flex items-center gap-2 mt-1">Registration Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
            </div>
          )}

        </div>
      </motion.div>

      </div>

    </div>
  )
}

export default RegistrationStatus