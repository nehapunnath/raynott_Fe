import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { TuitionCoachingApi } from '../../services/TuitionCoachingApi'; 
import "tailwindcss";


const BasicInfo = () => {
  const [coachingCenter, setCoachingCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchCoachingDetails = async () => {
      try {
        setLoading(true);
        const response = await TuitionCoachingApi.getTuitionCoaching(id);
        if (response.success && response.data) {
          setCoachingCenter(response.data);
        } else {
          setError('Coaching center not found');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching coaching details');
      } finally {
        setLoading(false);
      }
    };

    fetchCoachingDetails();
  }, [id]);

  // Define infoItems and faqs only if coachingCenter is available
  const infoItems = coachingCenter ? [
    { icon: '🎯', label: 'Type of Coaching', value: coachingCenter.typeOfCoaching || 'N/A' },
    { icon: '📚', label: 'Courses Offered', value: coachingCenter.subjects?.join(', ') || 'N/A' },
    { icon: '⏰', label: 'Batch Types', value: coachingCenter.batchSize || 'N/A' },
    { icon: '🗣️', label: 'Language of Instruction', value: coachingCenter.language || 'N/A' },
    { icon: '🏢', label: 'Establishment Year', value: coachingCenter.establishmentYear || 'N/A' },
    { icon: '👨‍🏫', label: 'Faculty', value: coachingCenter.faculty || 'N/A' },
    { icon: '📖', label: 'Study Material', value: coachingCenter.studyMaterial || 'N/A' },
    { icon: '📝', label: 'Test Series', value: coachingCenter.tests || 'N/A' },
    { icon: '👩‍🏫', label: 'Student Teacher Ratio', value: coachingCenter.batchSize || 'N/A' },
    { icon: '❓', label: 'Doubt Sessions', value: coachingCenter.doubtSessions || 'N/A' },
    { icon: '🏛️', label: 'Infrastructure', value: coachingCenter.infrastructure || 'N/A' },
    { icon: '📈', label: 'Success Rate', value: coachingCenter.successRate || 'N/A' },
    { icon: '🎓', label: 'Demo Class Available', value: coachingCenter.demoClass || 'N/A' },
  ] : [];

  const faqs = coachingCenter ? [
    { question: 'When was the coaching center established?', answer: coachingCenter.establishmentYear || 'N/A' },
    { question: 'What courses are offered?', answer: coachingCenter.subjects?.join(', ') || 'N/A' },
    { question: 'What types of batches are available?', answer: coachingCenter.batchSize || 'N/A' },
    { question: 'Is study material provided?', answer: coachingCenter.studyMaterial || 'N/A' },
    { question: 'Are test series conducted?', answer: coachingCenter.tests || 'N/A' },
    { question: 'Can I attend a demo class?', answer: coachingCenter.demoClass || 'N/A' },
  ] : [];

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index); // Toggle open/close state
  };

  if (loading) {
    return <div className="text-center text-gray-600 p-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-6">{error}</div>;
  }

  if (!coachingCenter) {
    return <div className="text-center text-gray-600 p-6">No coaching center found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Coaching Center Information Grid */}
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
                animate={openFaqIndex === index ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
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