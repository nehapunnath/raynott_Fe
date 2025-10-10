import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChalkboardTeacher, FaGraduationCap, FaBook, FaLanguage, FaAward, FaClock, FaLaptop, FaUserGraduate, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { teacherApi } from '../../services/TeacherApi';
import "tailwindcss";


const BasicInfo = () => {
  const { id } = useParams(); 
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  
  useEffect(() => {
    const fetchMentorDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await teacherApi.getPersonalMentorDetails(id);
        console.log('API response:', response);
        if (response.success && response.data) {
          const { basicInfo = {}, mentoringDetails = {}, expertise = {}, availability = {}, about } = response.data;
          const mentorData = {
            name: basicInfo.name || 'Not specified',
            subjects: basicInfo.subjects
              ? Array.isArray(basicInfo.subjects)
                ? basicInfo.subjects
                : basicInfo.subjects.split(',').map(s => s.trim())
              : [],
            qualification: basicInfo.qualification || 'Not specified',
            experience: basicInfo.experience || 'Not specified',
            teachingMode: mentoringDetails.mentoringMode
              ? Array.isArray(mentoringDetails.mentoringMode)
                ? mentoringDetails.mentoringMode
                : mentoringDetails.mentoringMode.split(',').map(mode => mode.trim())
              : ['Not specified'],
            languages: expertise.languages
              ? Array.isArray(expertise.languages)
                ? expertise.languages
                : expertise.languages.split(',').map(l => l.trim())
              : [],
            specialization: expertise.skills
              ? Array.isArray(expertise.skills)
                ? expertise.skills
                : expertise.skills.split(',').map(s => s.trim())
              : [],
            certifications: expertise.certifications
              ? Array.isArray(expertise.certifications)
                ? expertise.certifications
                : expertise.certifications.split(',').map(c => c.trim())
              : [],
            about: about || 'No description available',
            availability: availability.availability || 'Not specified',
            demoAvailable: mentoringDetails.demoFee?.toLowerCase() === 'free',
          };
          console.log('Mapped mentor data:', mentorData); // Debug: Log mapped data
          setMentor(mentorData);
        } else {
          setError('Failed to fetch mentor details');
        }
      } catch (err) {
        console.error('Error fetching mentor details:', err);
        setError(err.message || 'Failed to load mentor details');
      } finally {
        setLoading(false);
      }
    };

    fetchMentorDetails();
  }, [id]);

  // FAQ generation based on mentor data
  const faqs = mentor
    ? [
        { question: `What subjects does ${mentor.name.split(' ')[0]} teach?`, answer: mentor.subjects.join(', ') || 'Not specified' },
        { question: `What is ${mentor.name.split(' ')[0]}'s teaching experience?`, answer: mentor.experience },
        { question: `What are ${mentor.name.split(' ')[0]}'s qualifications?`, answer: mentor.qualification },
        { question: `Does ${mentor.name.split(' ')[0]} offer demo classes?`, answer: mentor.demoAvailable ? 'Yes' : 'No' },
        { question: `What teaching modes are available?`, answer: mentor.teachingMode.join(', ') || 'Not specified' },
        { question: `What languages does ${mentor.name.split(' ')[0]} speak?`, answer: mentor.languages.join(', ') || 'Not specified' },
      ]
    : [];

  // Info items for the grid
  const infoItems = mentor
    ? [
        { icon: <FaChalkboardTeacher className="text-orange-600" />, label: 'Subjects', value: mentor.subjects.join(', ') || 'Not specified' },
        { icon: <FaGraduationCap className="text-orange-600" />, label: 'Qualifications', value: mentor.qualification },
        { icon: <FaClock className="text-orange-600" />, label: 'Experience', value: mentor.experience },
        { icon: <FaLaptop className="text-orange-600" />, label: 'Mentoring Mode', value: mentor.teachingMode.join(', ') || 'Not specified' },
        { icon: <FaLanguage className="text-orange-600" />, label: 'Languages', value: mentor.languages.join(', ') || 'Not specified' },
        { icon: <FaUserGraduate className="text-orange-600" />, label: 'Specialization', value: mentor.specialization.join(', ') || 'Not specified' },
        { icon: <FaAward className="text-orange-600" />, label: 'Certifications', value: mentor.certifications.join(', ') || 'Not specified' },
        { icon: <FaClock className="text-orange-600" />, label: 'Availability', value: mentor.availability },
      ]
    : [];

  // Toggle FAQ open/close state
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-lg text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading mentor details...</p>
      </div>
    );
  }

  if (error || !mentor) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-lg text-center">
        <p className="text-red-600">{error || 'Mentor not found'}</p>
      </div>
    );
  }

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

      {/* About Mentor */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="p-6 bg-white rounded-xl shadow-lg"
      >
        <h3 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">
          About {mentor.name.split(' ')[0]}
        </h3>
        <p className="text-gray-700 leading-relaxed">{mentor.about}</p>
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