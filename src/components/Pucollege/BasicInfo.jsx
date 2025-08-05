import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const BasicInfo = () => {
  const info = {
    typeOfCollege: 'Pre-University',
    board: 'State Board',
    streams: 'Science, Commerce, Arts',
    subjects: 'PCMB, Commerce, Humanities',
    language: 'English',
    establishmentYear: '2010',
    accreditation: 'Yes',
    hostel: 'No',
    library: 'Yes',
    labs: 'Yes',
    studentTeacherRatio: '25:1',
    transportation: 'No',
    sports: 'Yes',
    competitiveExamPrep: 'Yes',
  };

  const faqs = [
    { question: 'When was the PU College established?', answer: info.establishmentYear },
    { question: 'Which board is the college affiliated to?', answer: info.board },
    { question: 'What streams are offered?', answer: info.streams },
    { question: 'Does the college provide competitive exam preparation?', answer: info.competitiveExamPrep },
    { question: 'What is the student-teacher ratio?', answer: info.studentTeacherRatio },
    { question: 'Are there science labs available?', answer: info.labs },
  ];

  const infoItems = [
    { icon: '🏫', label: 'Type of College', value: info.typeOfCollege },
    { icon: '📜', label: 'Board', value: info.board },
    { icon: '📚', label: 'Streams Offered', value: info.streams },
    { icon: '🧪', label: 'Subjects Offered', value: info.subjects },
    { icon: '🗣️', label: 'Language of Instruction', value: info.language },
    { icon: '🏢', label: 'Establishment Year', value: info.establishmentYear },
    { icon: '⭐', label: 'Accreditation', value: info.accreditation },
    { icon: '🏠', label: 'Hostel Facility', value: info.hostel },
    { icon: '📚', label: 'Library', value: info.library },
    { icon: '🔬', label: 'Labs', value: info.labs },
    { icon: '👩‍🏫', label: 'Student Teacher Ratio', value: info.studentTeacherRatio },
    { icon: '🚌', label: 'Transportation', value: info.transportation },
    { icon: '⚽', label: 'Sports Facilities', value: info.sports },
    { icon: '📝', label: 'Competitive Exam Prep', value: info.competitiveExamPrep },
  ];

  return (
    <div className="space-y-6">
      {/* PU College Information Grid */}
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
          {faqs.map((faq, index) => {
            const [isOpen, setIsOpen] = useState(false);
            return (
              <motion.div 
                key={index}
                className="border-b border-orange-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <motion.button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full text-left py-4 px-3 flex justify-between items-center hover:bg-orange-50 rounded-lg transition-colors"
                  whileHover={{ backgroundColor: 'rgba(254, 215, 170, 0.3)' }}
                >
                  <span className="font-medium text-gray-800">{faq.question}</span>
                  {isOpen ? (
                    <FaChevronUp className="text-orange-500" />
                  ) : (
                    <FaChevronDown className="text-orange-500" />
                  )}
                </motion.button>
                
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-4 text-gray-700 font-medium">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default BasicInfo;