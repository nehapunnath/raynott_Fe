import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaRupeeSign, FaSchool, FaFlask, FaBook,
  FaRunning, FaTheaterMasks, FaChalkboardTeacher,
  FaVideo, FaFirstAid, FaWifi, FaLink, FaClipboardList
} from 'react-icons/fa';
import { GiMoneyStack } from 'react-icons/gi';
import { useParams } from 'react-router-dom';
import { collegeApi } from '../../services/collegeApi';
import "tailwindcss";


const FeeStructure = () => {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch college details
  useEffect(() => {
    const fetchCollegeDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(`Fetching college with ID: ${id}`);
        const response = await collegeApi.getCollege(id);
        console.log('College API response:', response);
        const collegeData = response.data || {};

        // Format college data with fallback values
        const formattedCollege = {
          id: collegeData.id || id,
          totalAnnualFee: collegeData.totalAnnualFee || null,
          admissionFee: collegeData.admissionFee || null,
          tuitionFee: collegeData.tuitionFee || null,
          transportFee: collegeData.transportFee || null,
          booksUniformsFee: collegeData.booksUniformsFee || null,
          campusSize: collegeData.campusSize || 'N/A',
          classrooms: collegeData.classrooms || 'N/A',
          laboratories: collegeData.laboratories || 'N/A',
          library: collegeData.library || 'N/A',
          playground: collegeData.playground || 'N/A',
          auditorium: collegeData.auditorium || 'N/A',
          smartBoards: collegeData.smartBoards || 'N/A',
          cctv: collegeData.cctv || 'N/A',
          medicalRoom: collegeData.medicalRoom || 'N/A',
          wifi: collegeData.wifi || 'N/A',
          admissionLink: collegeData.admissionLink || 'https://example.com/admission',
          admissionProcess: collegeData.admissionProcess || 'N/A',
        };
        setCollege(formattedCollege);
      } catch (err) {
        console.error('Error fetching college details:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch college details');
        setCollege(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCollegeDetails();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p className="text-gray-700">Loading fee structure and infrastructure details...</p>
      </div>
    );
  }

  // Error state
  if (error || !college) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">{error || 'Failed to load fee structure and infrastructure details'}</p>
      </div>
    );
  }

  // Fallback values for fee details
  const feeDetails = [
    {
      icon: <GiMoneyStack className="text-amber-700" />,
      label: 'Total Annual Fee',
      value: college?.totalAnnualFee ? `₹${college.totalAnnualFee.toLocaleString()}/year` : 'N/A'
    },
    {
      icon: <FaRupeeSign className="text-amber-600" />,
      label: 'Admission Fee',
      value: college?.admissionFee ? `₹${college.admissionFee.toLocaleString()}` : 'N/A'
    },
    {
      icon: <FaRupeeSign className="text-amber-600" />,
      label: 'Tuition Fee',
      value: college?.tuitionFee ? `₹${college.tuitionFee.toLocaleString()}` : 'N/A'
    },
    {
      icon: <FaRupeeSign className="text-amber-600" />,
      label: 'Transport Fee',
      value: college?.transportFee ? `₹${college.transportFee.toLocaleString()} (optional)` : 'N/A'
    },
    {
      icon: <FaRupeeSign className="text-amber-600" />,
      label: 'Books & Uniforms',
      value: college?.booksUniformsFee ? `₹${college.booksUniformsFee.toLocaleString()}` : 'N/A'
    }
  ];

  // Fallback values for infrastructure details
  const infrastructureDetails = [
    { icon: <FaSchool className="text-amber-700" />, label: 'Campus Size', value: college?.campusSize || 'N/A' },
    { icon: <FaSchool className="text-amber-700" />, label: 'Classrooms', value: college?.classrooms || 'N/A' },
    { icon: <FaFlask className="text-amber-600" />, label: 'Laboratories', value: college?.laboratories || 'N/A' },
    { icon: <FaBook className="text-amber-600" />, label: 'Library', value: college?.library || 'N/A' },
    { icon: <FaRunning className="text-amber-500" />, label: 'Playground', value: college?.playground || 'N/A' },
    { icon: <FaTheaterMasks className="text-amber-500" />, label: 'Auditorium', value: college?.auditorium || 'N/A' },
    {
      icon: <FaChalkboardTeacher className="text-amber-400" />,
      label: 'Smart Boards',
      value: college?.smartBoards || 'N/A'
    },
    { icon: <FaVideo className="text-amber-400" />, label: 'CCTV', value: college?.cctv || 'N/A' },
    { icon: <FaFirstAid className="text-amber-300" />, label: 'Medical Room', value: college?.medicalRoom || 'N/A' },
    { icon: <FaWifi className="text-amber-300" />, label: 'Wi-Fi', value: college?.wifi || 'N/A' }
  ];

  // Admission details
  const admissionLink = college?.admissionLink || 'https://example.com/admission';
  const admissionProcess = college?.admissionProcess || 'N/A';

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
                <div className="bg-amber-100 p-3 rounded-full mr-4">{item.icon}</div>
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
              <span className="border-b-4 border-amber-400 pb-2">College Infrastructure</span>
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

      /* Admission Section */
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
                href={admissionLink}
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
                <p className="text-gray-700 text-center">{admissionProcess}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FeeStructure;