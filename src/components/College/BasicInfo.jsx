import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { collegeApi } from '../../services/collegeApi';
import { useParams } from 'react-router-dom';
import "tailwindcss";


const BasicInfo = () => {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null); // Single state for FAQ toggle

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
          name: collegeData.name || 'Unnamed College',
          address: collegeData.address || collegeData.city || 'Unknown Location',
          typeOfCollege: collegeData.typeOfCollege || 'N/A',
          affiliation: collegeData.affiliation || 'N/A',
          coursesOffered: collegeData.coursesOffered || ['Course 1', 'Course 2'],
          duration: collegeData.duration || 'N/A',
          language: collegeData.language || 'N/A',
          establishmentYear: collegeData.establishmentYear || 'N/A',
          accreditation: collegeData.accreditation || 'N/A',
          hostel: collegeData.hostel || 'N/A',
          library: collegeData.library || 'N/A',
          laboratories: collegeData.laboratories || 'N/A',
          studentTeacherRatio: collegeData.studentTeacherRatio || 'N/A',
          transportation: collegeData.transportation || 'N/A',
          playground: collegeData.playground || 'N/A',
          placementStatistics: {
            percentage: collegeData.placementStatistics?.percentage || 'N/A',
          },
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

  // Toggle FAQ open/closed state
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Fallback values for college info
  const info = {
    typeOfCollege: college?.typeOfCollege || 'N/A',
    affiliation: college?.affiliation || 'N/A',
    courses: college?.coursesOffered?.join(', ') || 'N/A',
    duration: college?.duration || 'N/A',
    language: college?.language || 'N/A',
    establishmentYear: college?.establishmentYear || 'N/A',
    accreditation: college?.accreditation || 'N/A',
    hostel: college?.hostel || 'N/A',
    library: college?.library || 'N/A',
    labs: college?.laboratories || 'N/A',
    studentTeacherRatio: college?.studentTeacherRatio || 'N/A',
    transportation: college?.transportation || 'N/A',
    sports: college?.playground || 'N/A',
    placement: college?.placementStatistics?.percentage || 'N/A',
  };

  // FAQ section
  const faqs = [
    { question: 'When was the college established?', answer: info.establishmentYear },
    { question: 'Which university is the college affiliated to?', answer: info.affiliation },
    { question: 'What courses are offered?', answer: info.courses },
    { question: 'Does the college have hostel facilities?', answer: info.hostel },
    { question: 'What is the placement percentage?', answer: info.placement },
    { question: 'Is the college accredited?', answer: info.accreditation },
  ];

  // Info items for the grid
  const infoItems = [
    { icon: '🏫', label: 'Type of College', value: info.typeOfCollege },
    { icon: '📜', label: 'Affiliation', value: info.affiliation },
    { icon: '🎓', label: 'Courses Offered', value: info.courses },
    { icon: '⏳', label: 'Duration', value: info.duration },
    { icon: '🗣️', label: 'Language of Instruction', value: info.language },
    { icon: '🏢', label: 'Establishment Year', value: info.establishmentYear },
    { icon: '⭐', label: 'Accreditation', value: info.accreditation },
    { icon: '🏠', label: 'Hostel Facility', value: info.hostel },
    { icon: '📚', label: 'Library', value: info.library },
    { icon: '🔬', label: 'Labs', value: info.labs },
    { icon: '👩‍🏫', label: 'Student Teacher Ratio', value: info.studentTeacherRatio },
    { icon: '🚌', label: 'Transportation', value: info.transportation },
    { icon: '⚽', label: 'Sports Facilities', value: info.sports },
    { icon: '💼', label: 'Placement Percentage', value: info.placement },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-700">Loading college information...</p>
      </div>
    );
  }

  // Error state
  if (error || !college) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">{error || 'Failed to load college information'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* College Information Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-white rounded-xl shadow-lg"
      >
        {infoItems.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg"
          >
            <span className="text-2xl">{item.icon}</span>
            <div>
              <h4 className="font-medium text-gray-700">{item.label}</h4>
              <p className="text-orange-600 font-semibold">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="p-6 bg-white rounded-xl shadow-lg"
      >
        <h3 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">
          Frequently Asked Questions
        </h3>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="border-b border-orange-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <motion.button
                onClick={() => toggleFaq(index)}
                className="w-full text-left py-4 px-3 flex justify-between items-center hover:bg-orange-50 rounded-lg transition-colors"
                whileHover={{ backgroundColor: 'rgba(254, 215, 170, 0.3)' }}
              >
                <span className="font-medium text-gray-800">{faq.question}</span>
                {openFaqIndex === index ? (
                  <FaChevronUp className="text-orange-500" />
                ) : (
                  <FaChevronDown className="text-orange-500" />
                )}
              </motion.button>

              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={
                  openFaqIndex === index ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }
                }
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-3 pb-4 text-gray-700 font-medium">{faq.answer}</div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BasicInfo;