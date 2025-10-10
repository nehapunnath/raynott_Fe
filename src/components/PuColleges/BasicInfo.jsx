
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { puCollegeApi } from '../../services/pucollegeApi';
import "tailwindcss";


const BasicInfo = ({ puCollege: puCollegeProp }) => {
  const { id } = useParams(); // Get college ID from URL
  const [puCollege, setPUCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFaqs, setOpenFaqs] = useState({}); // Single state for all FAQ open/closed states

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
        console.log('BasicInfo API response:', response);

        if (!response.success || !response.data) {
          throw new Error('College data not found');
        }

        const collegeData = response.data;
        const mappedCollege = {
          id: collegeData.id || collegeData._id || id,
          name: collegeData.name || 'Unnamed College',
          board: collegeData.board || 'Karnataka PU Board',
          established: collegeData.established || 2010,
          streams: Array.isArray(collegeData.streams)
            ? collegeData.streams
            : typeof collegeData.streams === 'string'
            ? collegeData.streams.split(', ')
            : ['Science', 'Commerce', 'Arts'],
          facilities: Array.isArray(collegeData.facilities)
            ? collegeData.facilities
            : typeof collegeData.facilities === 'string'
            ? collegeData.facilities.split(', ')
            : ['Smart Classes', 'Laboratories', 'Library'],
          // Additional fields with fallbacks
          typeOfCollege: collegeData.typeOfCollege || 'Pre-University',
          subjects: collegeData.subjects || 'PCMB, Commerce, Humanities',
          language: collegeData.language || 'English',
          accreditation: collegeData.accreditation || 'Yes',
          hostel: collegeData.hostel || 'No',
          studentTeacherRatio: collegeData.studentTeacherRatio || '25:1',
          transportation: collegeData.transportation || 'No',
          competitiveExamPrep: collegeData.competitiveExamPrep || 'Yes',
        };

        setPUCollege(mappedCollege);
      } catch (err) {
        console.error('Error fetching PU College data in BasicInfo:', err);
        setError('Failed to load college information. Using fallback data.');
        // Fallback to prop or default data
        setPUCollege(
          puCollegeProp || {
            typeOfCollege: 'Pre-University',
            board: 'Karnataka PU Board',
            streams: ['Science', 'Commerce', 'Arts'],
            subjects: 'PCMB, Commerce, Humanities',
            language: 'English',
            established: '2010',
            accreditation: 'Yes',
            hostel: 'No',
            facilities: ['Library', 'Laboratories'],
            studentTeacherRatio: '25:1',
            transportation: 'No',
            competitiveExamPrep: 'Yes',
          }
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCollegeData();
  }, [id, puCollegeProp]);

  // Prepare info object from puCollege data
  const info = {
    typeOfCollege: puCollege?.typeOfCollege || 'Pre-University',
    board: puCollege?.board || 'Karnataka PU Board',
    streams: puCollege?.streams?.join(', ') || 'Science, Commerce, Arts',
    subjects: puCollege?.subjects || 'PCMB, Commerce, Humanities',
    language: puCollege?.language || 'English',
    establishmentYear: puCollege?.established?.toString() || '2010',
    accreditation: puCollege?.accreditation || 'Yes',
    hostel: puCollege?.hostel || 'No',
    library: puCollege?.facilities?.includes('Library') ? 'Yes' : 'No',
    labs: puCollege?.facilities?.includes('Laboratories') ? 'Yes' : 'No',
    studentTeacherRatio: puCollege?.studentTeacherRatio || '25:1',
    transportation: puCollege?.transportation || 'No',
    sports: puCollege?.facilities?.includes('Sports') ? 'Yes' : 'No',
    competitiveExamPrep: puCollege?.competitiveExamPrep || 'Yes',
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

  // Toggle FAQ open/closed state
  const toggleFaq = (index) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
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
