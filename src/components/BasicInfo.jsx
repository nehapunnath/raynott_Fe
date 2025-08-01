import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const BasicInfo = () => {
  const info = {
    typeOfSchool: 'Day School',
    affiliation: 'CBSE',
    grade: 'Nursery till Class 12',
    ageForAdmission: '03 Year(s)',
    language: 'English',
    establishmentYear: '1965',
    swimming: 'No',
    indoorSports: 'Yes',
    acClasses: 'No',
    studentTeacherRatio: '30:1',
    transportation: 'No',
    outdoorSports: 'Yes',
    maximumAge: 'NA',
  };

  const faqs = [
    { question: 'When did the Arya Central School, Trivandrum start?', answer: '1965' },
    { question: 'Which curriculum does the Arya Central School, Trivandrum follow?', answer: 'CBSE' },
    { question: 'From which grade does the school begin?', answer: 'Nursery' },
    { question: 'Till which grade is the school affiliated?', answer: 'Class 12' },
    { question: 'Does the school have e-class facility?', answer: 'Yes' },
    { question: 'Does the school have in-house medical facility?', answer: 'No' },
  ];

  const infoItems = [
    { icon: '🏫', label: 'Type of School', value: info.typeOfSchool },
    { icon: '📜', label: 'Affiliation / Examination Board', value: info.affiliation },
    { icon: '📚', label: 'Grade', value: info.grade },
    { icon: '👶', label: 'Age for Admission', value: info.ageForAdmission },
    { icon: '🗣️', label: 'Language of Instruction', value: info.language },
    { icon: '🏢', label: 'Establishment Year', value: info.establishmentYear },
    { icon: '🏊‍♂️', label: 'Swimming / Splash Pool', value: info.swimming },
    { icon: '🏋️', label: 'Indoor Sports', value: info.indoorSports },
    { icon: '❄️', label: 'AC Classes', value: info.acClasses },
    { icon: '👩‍🏫', label: 'Student Teacher Ratio', value: info.studentTeacherRatio },
    { icon: '🚌', label: 'Transportation', value: info.transportation },
    { icon: '🌳', label: 'Outdoor Sports', value: info.outdoorSports },
    { icon: '👴', label: 'Maximum Age', value: info.maximumAge },
  ];

  return (
    <div className="space-y-6">
      {/* School Information Grid */}
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