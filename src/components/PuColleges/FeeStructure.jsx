
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaRupeeSign, FaSchool, FaFlask, FaBook, 
  FaRunning, FaTheaterMasks, FaChalkboardTeacher,
  FaVideo, FaFirstAid, FaWifi, FaLink, FaClipboardList
} from 'react-icons/fa';
import { GiMoneyStack } from 'react-icons/gi';
import { useParams } from 'react-router-dom';
import { puCollegeApi } from '../../services/pucollegeApi';

const FeeStructure = ({ puCollege: puCollegeProp }) => {
  const { id } = useParams(); // Get college ID from URL
  const [puCollege, setPUCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch college data from API
  useEffect(() => {
    const fetchCollegeData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use prop if provided and valid, otherwise fetch from API
        if (puCollegeProp && Object.keys(puCollegeProp).length > 0) {
          setPUCollege(puCollegeProp);
          setLoading(false);
          return;
        }

        // Fetch college data by ID
        const response = await puCollegeApi.getPUCollege(id);
        console.log('FeeStructure API response:', response);

        if (!response.success || !response.data) {
          throw new Error('College data not found');
        }

        const collegeData = response.data;
        const mappedCollege = {
          id: collegeData.id || collegeData._id || id,
          fees: collegeData.fees || {
            totalAnnualFee: '₹1,54,000/year',
            admissionFee: '₹25,000',
            tuitionFee: '₹1,00,000',
            transportFee: '₹15,000 (optional)',
            booksAndUniforms: '₹14,000',
          },
          facilities: Array.isArray(collegeData.facilities)
            ? collegeData.facilities
            : typeof collegeData.facilities === 'string'
            ? collegeData.facilities.split(', ')
            : ['Laboratories', 'Library', 'Playground', 'Auditorium', 'Smart Boards', 'CCTV', 'Medical Room', 'Wi-Fi'],
          campusSize: collegeData.campusSize || '10 acres',
          classrooms: collegeData.classrooms || '40+',
          admissionLink: collegeData.admissionLink || 'https://example.com/admission',
          admissionProcess:
            collegeData.admissionProcess ||
            'The admission process involves submitting an online application form, followed by an entrance test and an interview. Documents required include birth certificate, previous academic records, and identity proof.',
        };

        setPUCollege(mappedCollege);
      } catch (err) {
        console.error('Error fetching PU College data in FeeStructure:', err);
        setError('Failed to load fee and infrastructure information. Using fallback data.');
        // Fallback to prop or default data
        setPUCollege(
          puCollegeProp || {
            fees: {
              totalAnnualFee: '₹1,54,000/year',
              admissionFee: '₹25,000',
              tuitionFee: '₹1,00,000',
              transportFee: '₹15,000 (optional)',
              booksAndUniforms: '₹14,000',
            },
            facilities: ['Laboratories', 'Library', 'Playground', 'Auditorium', 'Smart Boards', 'CCTV', 'Medical Room', 'Wi-Fi'],
            campusSize: '10 acres',
            classrooms: '40+',
            admissionLink: 'https://example.com/admission',
            admissionProcess:
              'The admission process involves submitting an online application form, followed by an entrance test and an interview. Documents required include birth certificate, previous academic records, and identity proof.',
          }
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCollegeData();
  }, [id, puCollegeProp]);

  // Prepare feeDetails and infrastructureDetails from puCollege data
  const feeDetails = [
    { icon: <GiMoneyStack className="text-amber-700" />, label: 'Total Annual Fee', value: puCollege?.fees?.totalAnnualFee || '₹1,54,000/year' },
    { icon: <FaRupeeSign className="text-amber-600" />, label: 'Admission Fee', value: puCollege?.fees?.admissionFee || '₹25,000' },
    { icon: <FaRupeeSign className="text-amber-600" />, label: 'Tuition Fee', value: puCollege?.fees?.tuitionFee || '₹1,00,000' },
    { icon: <FaRupeeSign className="text-amber-600" />, label: 'Transport Fee', value: puCollege?.fees?.transportFee || '₹15,000 (optional)' },
    { icon: <FaRupeeSign className="text-amber-600" />, label: 'Books & Uniforms', value: puCollege?.fees?.booksAndUniforms || '₹14,000' },
  ];

  const infrastructureDetails = [
    { icon: <FaSchool className="text-amber-700" />, label: 'Campus Size', value: puCollege?.campusSize || '10 acres' },
    { icon: <FaSchool className="text-amber-700" />, label: 'Classrooms', value: puCollege?.classrooms || '40+' },
    {
      icon: <FaFlask className="text-amber-600" />,
      label: 'Laboratories',
      value: puCollege?.facilities?.includes('Laboratories') ? 'Yes' : 'No',
    },
    { icon: <FaBook className="text-amber-600" />, label: 'Library', value: puCollege?.facilities?.includes('Library') ? 'Yes' : 'No' },
    {
      icon: <FaRunning className="text-amber-500" />,
      label: 'Playground',
      value: puCollege?.facilities?.includes('Playground') ? 'Yes' : 'No',
    },
    {
      icon: <FaTheaterMasks className="text-amber-500" />,
      label: 'Auditorium',
      value: puCollege?.facilities?.includes('Auditorium') ? 'Yes' : 'No',
    },
    {
      icon: <FaChalkboardTeacher className="text-amber-400" />,
      label: 'Smart Boards',
      value: puCollege?.facilities?.includes('Smart Boards') ? 'Yes' : 'No',
    },
    { icon: <FaVideo className="text-amber-400" />, label: 'CCTV', value: puCollege?.facilities?.includes('CCTV') ? 'Yes' : 'No' },
    {
      icon: <FaFirstAid className="text-amber-300" />,
      label: 'Medical Room',
      value: puCollege?.facilities?.includes('Medical Room') ? 'Yes' : 'No',
    },
    { icon: <FaWifi className="text-amber-300" />, label: 'Wi-Fi', value: puCollege?.facilities?.includes('Wi-Fi') ? 'Yes' : 'No' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 font-medium p-8">
        {error}
      </div>
    );
  }

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
                href={puCollege?.admissionLink || 'https://example.com/admission'}
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
                  {puCollege?.admissionProcess ||
                    'The admission process involves submitting an online application form, followed by an entrance test and an interview. Documents required include birth certificate, previous academic records, and identity proof.'}
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
