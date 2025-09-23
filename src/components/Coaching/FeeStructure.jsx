import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaRupeeSign, FaSchool, FaFlask, FaBook,
  FaRunning, FaTheaterMasks, FaChalkboardTeacher,
  FaVideo, FaFirstAid, FaWifi, FaLink, FaClipboardList
} from 'react-icons/fa';
import { GiMoneyStack } from 'react-icons/gi';
import { useParams } from 'react-router-dom';
import { TuitionCoachingApi } from '../../services/TuitionCoachingApi'; // Adjust path as needed

const FeeStructure = () => {
  const { id } = useParams();
  const [coachingCenter, setCoachingCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch coaching center details
  useEffect(() => {
    const fetchCoachingDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(`Fetching coaching center with ID: ${id}`);
        const response = await TuitionCoachingApi.getTuitionCoaching(id);
        console.log('Coaching API response:', response);
        const coachingData = response.data || {};

        // Format coaching data with fallback values
        const formattedCoaching = {
          id: coachingData.id || id,
          totalAnnualFee: coachingData.totalAnnualFee || null,
          admissionFee: coachingData.admissionFee || null,
          tuitionFee: coachingData.tuitionFee || null,
          transportFee: coachingData.transportFee || null,
          booksUniformsFee: coachingData.booksUniformsFee || null,
          classrooms: coachingData.classrooms || 'N/A',
          laboratories: coachingData.laboratories || 'N/A',
          library: coachingData.library || 'N/A',
          smartBoards: coachingData.smartBoards || 'N/A',
          cctv: coachingData.cctv || 'N/A',
          medicalRoom: coachingData.medicalRoom || 'N/A',
          wifi: coachingData.wifi || 'N/A',
          admissionLink: coachingData.admissionLink || 'https://example.com/admission',
          admissionProcess: coachingData.admissionProcess || 'The admission process involves submitting an online application form, followed by an entrance test and an interview. Documents required include birth certificate, previous academic records, and identity proof.',
          // Fields not in model, set to N/A
          campusSize: 'N/A',
          playground: 'N/A',
          auditorium: 'N/A',
        };
        setCoachingCenter(formattedCoaching);
      } catch (err) {
        console.error('Error fetching coaching details:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch coaching details');
        setCoachingCenter(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCoachingDetails();
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
  if (error || !coachingCenter) {
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
      value: coachingCenter?.totalAnnualFee ? `₹${coachingCenter.totalAnnualFee.toLocaleString()}/year` : 'N/A'
    },
    {
      icon: <FaRupeeSign className="text-amber-600" />,
      label: 'Admission Fee',
      value: coachingCenter?.admissionFee ? `₹${coachingCenter.admissionFee.toLocaleString()}` : 'N/A'
    },
    {
      icon: <FaRupeeSign className="text-amber-600" />,
      label: 'Tuition Fee',
      value: coachingCenter?.tuitionFee ? `₹${coachingCenter.tuitionFee.toLocaleString()}` : 'N/A'
    },
    {
      icon: <FaRupeeSign className="text-amber-600" />,
      label: 'Transport Fee',
      value: coachingCenter?.transportFee ? `₹${coachingCenter.transportFee.toLocaleString()} (optional)` : 'N/A'
    },
    {
      icon: <FaRupeeSign className="text-amber-600" />,
      label: 'Books & Uniforms',
      value: coachingCenter?.booksUniformsFee ? `₹${coachingCenter.booksUniformsFee.toLocaleString()}` : 'N/A'
    }
  ];

  // Fallback values for infrastructure details
  const infrastructureDetails = [
    { icon: <FaSchool className="text-amber-700" />, label: 'Campus Size', value: coachingCenter?.campusSize || 'N/A' },
    { icon: <FaSchool className="text-amber-700" />, label: 'Classrooms', value: coachingCenter?.classrooms || 'N/A' },
    { icon: <FaFlask className="text-amber-600" />, label: 'Laboratories', value: coachingCenter?.laboratories || 'N/A' },
    { icon: <FaBook className="text-amber-600" />, label: 'Library', value: coachingCenter?.library || 'N/A' },
    { icon: <FaRunning className="text-amber-500" />, label: 'Playground', value: coachingCenter?.playground || 'N/A' },
    { icon: <FaTheaterMasks className="text-amber-500" />, label: 'Auditorium', value: coachingCenter?.auditorium || 'N/A' },
    {
      icon: <FaChalkboardTeacher className="text-amber-400" />,
      label: 'Smart Boards',
      value: coachingCenter?.smartBoards || 'N/A'
    },
    { icon: <FaVideo className="text-amber-400" />, label: 'CCTV', value: coachingCenter?.cctv || 'N/A' },
    { icon: <FaFirstAid className="text-amber-300" />, label: 'Medical Room', value: coachingCenter?.medicalRoom || 'N/A' },
    { icon: <FaWifi className="text-amber-300" />, label: 'Wi-Fi', value: coachingCenter?.wifi || 'N/A' }
  ];

  // Admission details
  const admissionLink = coachingCenter?.admissionLink || 'https://example.com/admission';
  const admissionProcess = coachingCenter?.admissionProcess || 'The admission process involves submitting an online application form, followed by an entrance test and an interview. Documents required include birth certificate, previous academic records, and identity proof.';

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
              <span className="border-b-4 border-amber-400 pb-2">Coaching Center Infrastructure</span>
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