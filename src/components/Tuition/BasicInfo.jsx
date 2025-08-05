import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const BasicInfo = () => {
  const info = {
    typeOfTuition: 'Academic Support',
    classes: '1st to 12th (All Subjects)',
    subjects: 'Math, Science, English, Social Studies',
    batchSize: '5-8 students per batch',
    language: 'English',
    establishmentYear: '2018',
    faculty: 'Experienced Teachers',
    studyMaterial: 'Yes',
    tests: 'Weekly',
    doubtSessions: 'Daily',
    infrastructure: 'Well-lit classrooms',
    demoClass: 'Yes',
    flexibleTimings: 'Yes',
  };

  const faqs = [
    { question: 'When was the tuition center established?', answer: info.establishmentYear },
    { question: 'Which classes do you cover?', answer: info.classes },
    { question: 'What is the batch size?', answer: info.batchSize },
    { question: 'Are tests conducted regularly?', answer: info.tests },
    { question: 'Is study material provided?', answer: info.studyMaterial },
    { question: 'Can I attend a demo class?', answer: info.demoClass },
  ];

  const infoItems = [
    { icon: '🏫', label: 'Type of Tuition', value: info.typeOfTuition },
    { icon: '👩‍🎓', label: 'Classes Covered', value: info.classes },
    { icon: '📚', label: 'Subjects Offered', value: info.subjects },
    { icon: '👥', label: 'Batch Size', value: info.batchSize },
    { icon: '🗣️', label: 'Language of Instruction', value: info.language },
    { icon: '🏢', label: 'Establishment Year', value: info.establishmentYear },
    { icon: '👨‍🏫', label: 'Faculty', value: info.faculty },
    { icon: '📖', label: 'Study Material', value: info.studyMaterial },
    { icon: '📝', label: 'Tests', value: info.tests },
    { icon: '❓', label: 'Doubt Sessions', value: info.doubtSessions },
    { icon: '🏛️', label: 'Infrastructure', value: info.infrastructure },
    { icon: '🎓', label: 'Demo Class Available', value: info.demoClass },
    { icon: '⏱️', label: 'Flexible Timings', value: info.flexibleTimings },
  ];

  return (
    <div className="space-y-6">
      {/* Tuition Center Information Grid */}
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