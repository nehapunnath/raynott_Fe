import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaRupeeSign, FaSchool, FaFlask, FaBook, 
  FaRunning, FaTheaterMasks, FaChalkboardTeacher,
  FaVideo, FaFirstAid, FaWifi, FaLink, FaClipboardList
} from 'react-icons/fa';
import { GiMoneyStack } from 'react-icons/gi';

const FeeStructure = () => {
  const feeDetails = [
    { icon: <GiMoneyStack className="text-amber-700" />, label: 'Total Annual Fee', value: '₹1,54,000/year' },
    { icon: <FaRupeeSign className="text-amber-600" />, label: 'Admission Fee', value: '₹25,000' },
    { icon: <FaRupeeSign className="text-amber-600" />, label: 'Tuition Fee', value: '₹1,00,000' },
    { icon: <FaRupeeSign className="text-amber-600" />, label: 'Transport Fee', value: '₹15,000 (optional)' },
    { icon: <FaRupeeSign className="text-amber-600" />, label: 'Books & Uniforms', value: '₹14,000' }
  ];

  const infrastructureDetails = [
    { icon: <FaSchool className="text-amber-700" />, label: 'Campus Size', value: '10 acres' },
    { icon: <FaSchool className="text-amber-700" />, label: 'Classrooms', value: '40+' },
    { icon: <FaFlask className="text-amber-600" />, label: 'Laboratories', value: 'Yes' },
    { icon: <FaBook className="text-amber-600" />, label: 'Library', value: 'Yes' },
    { icon: <FaRunning className="text-amber-500" />, label: 'Playground', value: 'Yes' },
    { icon: <FaTheaterMasks className="text-amber-500" />, label: 'Auditorium', value: 'Yes' },
    { icon: <FaChalkboardTeacher className="text-amber-400" />, label: 'Smart Boards', value: 'Yes' },
    { icon: <FaVideo className="text-amber-400" />, label: 'CCTV', value: 'Yes' },
    { icon: <FaFirstAid className="text-amber-300" />, label: 'Medical Room', value: 'Yes' },
    { icon: <FaWifi className="text-amber-300" />, label: 'Wi-Fi', value: 'Yes' }
  ];

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
                <GiMoneyStack className="text-3xl text-amber-700" />
              </div>
              <p className="text-2xl font-bold text-amber-800">{feeDetails[0].value}</p>
              <p className="text-center text-amber-700 mt-2">Includes tuition, lab, and library fees</p>
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

      {/* Infrastructure Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-xl overflow-hidden border border-amber-200"
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              <span className="border-b-4 border-amber-400 pb-2">School Infrastructure</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {infrastructureDetails.map((item, index) => (
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

      {/* Admission Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-xl overflow-hidden border border-amber-200"
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              <span className="border-b-4 border-amber-400 pb-2">Admission Details</span>
            </h2>
          </div>
          
          <div className="space-y-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-amber-100 p-3 rounded-full mr-3">
                  <FaLink className="text-2xl text-amber-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700">Admission Link</h3>
              </div>
              <motion.a
                href="https://example.com/admission"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 px-8 rounded-full transition-all shadow-lg"
              >
                Apply Now
              </motion.a>
            </div>
            
            <div>
              <div className="flex items-center justify-center mb-4">
                <div className="bg-amber-100 p-3 rounded-full mr-3">
                  <FaClipboardList className="text-2xl text-amber-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700">Admission Process</h3>
              </div>
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-5 rounded-xl border border-amber-300">
                <p className="text-gray-700 text-center">
                  The admission process involves submitting an online application form, followed by an entrance test and an interview. Documents required include birth certificate, previous academic records, and identity proof.
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