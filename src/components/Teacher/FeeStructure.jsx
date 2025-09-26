import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaRupeeSign, FaChalkboardTeacher, FaBook, 
  FaClock, FaGraduationCap, FaUserTie,
  FaVideo, FaCertificate, FaChartLine, FaSchool
} from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { teacherApi } from '../../services/TeacherApi';

const FeeStructure = () => {
  const { id } = useParams(); // Get the teacher ID from the URL
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch teacher details when the component mounts
  useEffect(() => {
    const fetchTeacherDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await teacherApi.getProfessionalTeacherDetails(id);
        if (response.success) {
          setTeacher(response.data);
        } else {
          setError('Failed to fetch teacher details');
        }
      } catch (err) {
        console.error('Error fetching teacher details:', err);
        setError(err.message || 'Failed to load teacher details');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherDetails();
  }, [id]);

  // Generate fee details from teacher data
  const generateFeeDetails = (teacherData) => {
    return [
      { icon: <FaRupeeSign className="text-amber-700" />, label: 'Hourly Rate', value: teacherData?.teachingDetails?.hourlyRate || 'Not specified' },
      { icon: <FaRupeeSign className="text-amber-600" />, label: 'Monthly Package', value: teacherData?.teachingDetails?.monthlyPackage || 'Not specified' },
      { icon: <FaRupeeSign className="text-amber-600" />, label: 'Exam Preparation', value: teacherData?.teachingDetails?.examPreparation || 'Not specified' },
      { icon: <FaRupeeSign className="text-amber-600" />, label: 'Demo Class', value: teacherData?.teachingDetails?.demoFee || 'Not specified' }
    ];
  };

  // Generate teaching details from teacher data
  const generateTeachingDetails = (teacherData) => {
    return [
      { icon: <FaChalkboardTeacher className="text-amber-700" />, label: 'Teaching Approach', value: teacherData?.teachingDetails?.teachingApproach || 'Not specified' },
      { icon: <FaBook className="text-amber-600" />, label: 'Study Materials', value: teacherData?.teachingDetails?.studyMaterials || 'Not specified' },
      { icon: <FaClock className="text-amber-500" />, label: 'Session Duration', value: teacherData?.teachingDetails?.sessionDuration || 'Not specified' },
      { icon: <FaGraduationCap className="text-amber-500" />, label: 'Student Level', value: teacherData?.teachingDetails?.studentLevel || 'Not specified' },
      { icon: <FaUserTie className="text-amber-400" />, label: 'Class Size', value: teacherData?.teachingDetails?.classSize || 'Not specified' },
      { icon: <FaVideo className="text-amber-400" />, label: 'Online Platform', value: teacherData?.teachingDetails?.onlinePlatform || 'Not specified' },
      { icon: <FaCertificate className="text-amber-300" />, label: 'Progress Reports', value: teacherData?.teachingDetails?.progressReports || 'Not specified' },
      { icon: <FaChartLine className="text-amber-300" />, label: 'Performance Tracking', value: teacherData?.teachingDetails?.performanceTracking || 'Not specified' }
    ];
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading fee structure...</p>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">{error || 'Fee structure not found'}</p>
      </div>
    );
  }

  const feeDetails = generateFeeDetails(teacher);
  const teachingDetails = generateTeachingDetails(teacher);

  return (
    <div className="space-y-8">
      {/* Fee Structure Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-xl overflow-hidden border border-amber-200"
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              <span className="border-b-4 border-amber-400 pb-2">Fee Structure</span>
            </h2>
          </div>
          
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-4 mb-6 border border-amber-300 shadow-inner">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center bg-white p-3 rounded-full shadow-md mb-3">
                <FaRupeeSign className="text-3xl text-amber-700" />
              </div>
              <p className="text-2xl font-bold text-amber-800">{feeDetails[0].value}</p>
              <p className="text-center text-amber-700 mt-2">Flexible payment options available</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feeDetails.slice(1).map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.2)' }}
                className="flex items-center p-4 bg-white rounded-lg border border-amber-200 shadow-sm"
              >
                <div className="bg-amber-100 p-3 rounded-full mr-4">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">{item.label}</h4>
                  <p className="text-amber-700 font-semibold">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Teaching Methodology Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-xl overflow-hidden border border-amber-200"
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              <span className="border-b-4 border-amber-400 pb-2">Teaching Methodology</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {teachingDetails.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="flex flex-col items-center p-4 bg-white rounded-lg border border-amber-200 shadow-sm text-center"
              >
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-3 rounded-full mb-3">
                  {React.cloneElement(item.icon, { className: 'text-2xl ' + item.icon.props.className })}
                </div>
                <h4 className="font-medium text-gray-700 mb-1">{item.label}</h4>
                <p className="text-amber-700 font-semibold">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Book Session Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-xl overflow-hidden border border-amber-200"
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              <span className="border-b-4 border-amber-400 pb-2">Book a Session</span>
            </h2>
          </div>
          
          <div className="space-y-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-amber-100 p-3 rounded-full mr-3">
                  <FaSchool className="text-2xl text-amber-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700">Available Slots</h3>
              </div>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold py-3 px-8 rounded-full transition-all shadow-lg"
              >
                View Calendar
              </motion.a>
            </div>
            
            <div>
              <div className="flex items-center justify-center mb-4">
                <div className="bg-amber-100 p-3 rounded-full mr-3">
                  <FaChalkboardTeacher className="text-2xl text-amber-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700">Teaching Process</h3>
              </div>
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-5 rounded-xl border border-amber-300">
                <p className="text-gray-700 text-center">
                  {teacher.availability.teachingProcess || 'Sessions begin with an assessment of the student\'s current level, followed by customized lesson plans. Regular progress evaluations and parent-teacher meetings ensure continuous improvement.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FeeStructure;