import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown, FaChevronUp, FaSpinner } from 'react-icons/fa';
import { schoolApi } from '../../services/schoolApi'; // Adjust the path as needed
import { useParams } from 'react-router-dom';

// Separate component for FAQ items
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      className="border-b border-orange-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-4 px-3 flex justify-between items-center hover:bg-orange-50 rounded-lg transition-colors"
        whileHover={{ backgroundColor: 'rgba(254, 215, 170, 0.3)' }}
      >
        <span className="font-medium text-gray-800">{question}</span>
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
          {answer}
        </div>
      </motion.div>
    </motion.div>
  );
};

const BasicInfo = () => {
  const { id } = useParams();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        setLoading(true);
        const response = await schoolApi.getSchool(id);
        setSchool(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch school data');
        console.error('Error fetching school data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSchoolData();
    }
  }, [id]);

  // Safely parse facilities
  const getFacilities = () => {
    if (!school?.facilities) return [];
    
    if (Array.isArray(school.facilities)) {
      return school.facilities;
    }
    
    try {
      if (typeof school.facilities === 'string') {
        const parsed = JSON.parse(school.facilities);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      console.error('Error parsing facilities:', error);
    }
    
    return [];
  };

  const facilities = getFacilities();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <FaSpinner className="animate-spin text-orange-600 text-3xl" />
        <span className="ml-3 text-gray-600">Loading school information...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>Error loading school information: {error}</p>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="text-center py-12 text-gray-600">
        <p>No school data found.</p>
      </div>
    );
  }

  // Map the actual fields from your AddSchools form
  const info = {
    typeOfSchool: school.typeOfSchool || 'Not specified',
    affiliation: school.affiliation || 'Not specified',
    grade: school.grade || 'Not specified',
    ageForAdmission: school.ageForAdmission || 'Not specified',
    language: school.language || 'Not specified',
    establishmentYear: school.establishmentYear || 'Not specified',
    // Infrastructure fields
    laboratories: school.laboratories === 'Yes' ? 'Yes' : 'No',
    library: school.library === 'Yes' ? 'Yes' : 'No',
    playground: school.playground === 'Yes' ? 'Yes' : 'No',
    auditorium: school.auditorium === 'Yes' ? 'Yes' : 'No',
    smartBoards: school.smartBoards === 'Yes' ? 'Yes' : 'No',
    cctv: school.cctv === 'Yes' ? 'Yes' : 'No',
    medicalRoom: school.medicalRoom === 'Yes' ? 'Yes' : 'No',
    wifi: school.wifi === 'Yes' ? 'Yes' : 'No',
    campusSize: school.campusSize || 'Not specified',
    classrooms: school.classrooms || 'Not specified',
    // Transportation from fee field
    transportation: school.transportFee ? 'Yes' : 'No'
  };

  const faqs = [
    { 
      question: `When did ${school.name} start?`, 
      answer: school.establishmentYear || 'Not specified' 
    },
    { 
      question: `Which curriculum does ${school.name} follow?`, 
      answer: school.affiliation || 'Not specified' 
    },
    { 
      question: 'From which grade does the school begin?', 
      answer: school.grade ? school.grade.split(' ')[0] : 'Not specified' 
    },
    { 
      question: 'Till which grade is the school affiliated?', 
      answer: school.grade || 'Not specified' 
    },
    { 
      question: 'Does the school have smart classes?', 
      answer: school.smartBoards === 'Yes' ? 'Yes' : 'No' 
    },
    { 
      question: 'Does the school have in-house medical facility?', 
      answer: school.medicalRoom === 'Yes' ? 'Yes' : 'No' 
    },
    { 
      question: 'Does the school provide transportation?', 
      answer: school.transportFee ? 'Yes' : 'No' 
    },
    { 
      question: 'Is the campus WiFi enabled?', 
      answer: school.wifi === 'Yes' ? 'Yes' : 'No' 
    }
  ];

  const infoItems = [
    { icon: '🏫', label: 'Type of School', value: info.typeOfSchool },
    { icon: '📜', label: 'Affiliation / Board', value: info.affiliation },
    { icon: '📚', label: 'Grade', value: info.grade },
    { icon: '👶', label: 'Age for Admission', value: info.ageForAdmission },
    { icon: '🗣️', label: 'Language of Instruction', value: info.language },
    { icon: '🏢', label: 'Establishment Year', value: info.establishmentYear },
    { icon: '🏋️', label: 'Laboratories', value: info.laboratories },
    { icon: '📖', label: 'Library', value: info.library },
    { icon: '⚽', label: 'Playground', value: info.playground },
    { icon: '🎭', label: 'Auditorium', value: info.auditorium },
    { icon: '📺', label: 'Smart Boards', value: info.smartBoards },
    { icon: '📹', label: 'CCTV Surveillance', value: info.cctv },
    { icon: '🏥', label: 'Medical Room', value: info.medicalRoom },
    { icon: '📶', label: 'WiFi', value: info.wifi },
    { icon: '🏰', label: 'Campus Size', value: info.campusSize },
    { icon: '🏫', label: 'Classrooms', value: info.classrooms },
    { icon: '🚌', label: 'Transportation', value: info.transportation }
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

      {/* Facilities Section */}
      {facilities.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-6 bg-white rounded-xl shadow-lg"
        >
          <h3 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">
            Facilities
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {facilities.map((facility, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-center font-medium"
              >
                {facility}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

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
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BasicInfo;