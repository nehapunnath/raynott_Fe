import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown, FaChevronUp, FaChalkboardTeacher, FaGraduationCap, FaBook, FaLanguage, FaAward, FaClock, FaMoneyBillWave, FaLaptop, FaUserGraduate } from 'react-icons/fa';

const BasicInfo = () => {
  const teacher = {
    name: 'Dr. Priya Sharma',
    subjects: ['Mathematics', 'Physics', 'Calculus'],
    qualification: 'PhD in Mathematics, M.Ed',
    experience: '12 years',
    teachingMode: ['Online', 'Offline'],
    languages: ['English', 'Hindi', 'Kannada'],
    specialization: ['Board Exam Preparation', 'IIT-JEE Foundation', 'Olympiad Training'],
    certifications: ['CBSE Certified Teacher', 'Google Certified Educator', 'STEM Pedagogy Certification'],
    about: 'Dr. Priya Sharma is a highly experienced mathematics educator with a passion for making complex concepts accessible to students. She specializes in board exam preparation and competitive entrance coaching.',
    availability: 'Mon-Sat: 9AM - 7PM',
    demoAvailable: true
  };

  const faqs = [
    { question: 'What subjects does Dr. Sharma teach?', answer: teacher.subjects.join(', ') },
    { question: 'What is Dr. Sharma\'s teaching experience?', answer: teacher.experience },
    { question: 'What are Dr. Sharma\'s qualifications?', answer: teacher.qualification },
    { question: 'Does Dr. Sharma offer demo classes?', answer: teacher.demoAvailable ? 'Yes' : 'No' },
    { question: 'What teaching modes are available?', answer: teacher.teachingMode.join(', ') },
    { question: 'What languages does Dr. Sharma speak?', answer: teacher.languages.join(', ') },
  ];

  const infoItems = [
    { icon: <FaChalkboardTeacher className="text-orange-600" />, label: 'Subjects', value: teacher.subjects.join(', ') },
    { icon: <FaGraduationCap className="text-orange-600" />, label: 'Qualifications', value: teacher.qualification },
    { icon: <FaClock className="text-orange-600" />, label: 'Experience', value: teacher.experience },
    { icon: <FaLaptop className="text-orange-600" />, label: 'Teaching Mode', value: teacher.teachingMode.join(', ') },
    { icon: <FaLanguage className="text-orange-600" />, label: 'Languages', value: teacher.languages.join(', ') },
    { icon: <FaUserGraduate className="text-orange-600" />, label: 'Specialization', value: teacher.specialization.join(', ') },
    { icon: <FaAward className="text-orange-600" />, label: 'Certifications', value: teacher.certifications.join(', ') },
    { icon: <FaClock className="text-orange-600" />, label: 'Availability', value: teacher.availability },
  ];

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
          About {teacher.name.split(' ')[0]}
        </h3>
        <p className="text-gray-700 leading-relaxed">{teacher.about}</p>
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