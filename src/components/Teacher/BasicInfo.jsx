import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown, FaChevronUp, FaChalkboardTeacher, FaGraduationCap, FaClock, FaLaptop, FaLanguage, FaUserGraduate, FaAward } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { teacherApi } from '../../services/TeacherApi';
import "tailwindcss";


const BasicInfo = () => {
  const { id } = useParams(); // Get the teacher ID from the URL
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFaqs, setOpenFaqs] = useState({}); // Single state to track open FAQs

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

  // FAQ generation based on teacher data
  const generateFaqs = (teacherData) => {
    return [
      { question: 'What subjects does the teacher teach?', answer: teacherData?.basicInfo?.subjects?.join(', ') || 'Not specified' },
      { question: 'What is the teacher\'s experience?', answer: teacherData?.basicInfo?.experience || 'Not specified' },
      { question: 'What are the teacher\'s qualifications?', answer: teacherData?.basicInfo?.qualification || 'Not specified' },
      { question: 'Does the teacher offer demo classes?', answer: teacherData?.teachingDetails?.demoFee?.toLowerCase() === 'free' ? 'Yes' : 'No' },
      { question: 'What teaching modes are available?', answer: teacherData?.teachingDetails?.teachingMode || 'Not specified' },
      { question: 'What languages does the teacher speak?', answer: teacherData?.specialization?.languages?.join(', ') || 'Not specified' },
    ];
  };

  // Info items for the grid
  const generateInfoItems = (teacherData) => {
    return [
      { icon: <FaChalkboardTeacher className="text-orange-600" />, label: 'Subjects', value: teacherData?.basicInfo?.subjects?.join(', ') || 'Not specified' },
      { icon: <FaGraduationCap className="text-orange-600" />, label: 'Qualifications', value: teacherData?.basicInfo?.qualification || 'Not specified' },
      { icon: <FaClock className="text-orange-600" />, label: 'Experience', value: teacherData?.basicInfo?.experience || 'Not specified' },
      { icon: <FaLaptop className="text-orange-600" />, label: 'Teaching Mode', value: teacherData?.teachingDetails?.teachingMode || 'Not specified' },
      { icon: <FaLanguage className="text-orange-600" />, label: 'Languages', value: teacherData?.specialization?.languages?.join(', ') || 'Not specified' },
      { icon: <FaUserGraduate className="text-orange-600" />, label: 'Specialization', value: teacherData?.specialization?.specialization?.join(', ') || 'Not specified' },
      { icon: <FaAward className="text-orange-600" />, label: 'Certifications', value: teacherData?.specialization?.certifications?.join(', ') || 'Not specified' },
      { icon: <FaClock className="text-orange-600" />, label: 'Availability', value: teacherData?.availability?.availability || 'Not specified' },
    ];
  };

  // Toggle FAQ open/close state
  const toggleFaq = (index) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading teacher details...</p>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">{error || 'Teacher details not found'}</p>
      </div>
    );
  }

  const faqs = generateFaqs(teacher);
  const infoItems = generateInfoItems(teacher);

  return (
    <div className="space-y-6">
      {/* Teacher Information Grid */}
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

      {/* About Teacher */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="p-6 bg-white rounded-xl shadow-lg"
      >
        <h3 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">
          About {teacher.basicInfo.name.split(' ')[0]}
        </h3>
        <p className="text-gray-700 leading-relaxed">{teacher.about || 'No description available'}</p>
      </motion.div>

      {/* FAQ Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
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
                {openFaqs[index] ? (
                  <FaChevronUp className="text-orange-500" />
                ) : (
                  <FaChevronDown className="text-orange-500" />
                )}
              </motion.button>
              
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={openFaqs[index] ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-3 pb-4 text-gray-700 font-medium">
                  {faq.answer}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BasicInfo;