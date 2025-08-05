import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSchool, FaChalkboardTeacher, FaMapMarkerAlt, FaPhone, FaEnvelope, 
  FaUserTie, FaBookOpen, FaCheck, FaHome, FaUniversity, FaGraduationCap, 
  FaUserGraduate, FaChalkboard, FaRupeeSign, FaFlask, FaBook, 
  FaRunning, FaTheaterMasks, FaVideo, FaFirstAid, FaWifi, FaLink, 
  FaClipboardList, FaStar, FaCalendarAlt, FaUsers, FaBus, FaUtensils,
  FaSwimmingPool, FaLaptop, FaMicroscope, FaMusic, FaPaintBrush
} from 'react-icons/fa';
import { GiMoneyStack, GiTeacher } from 'react-icons/gi';
import { IoMdTime } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    institutionType: '',
    institutionName: '',
    tagline: '',
    establishedYear: '',
    about: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    email: '',
    phone: '',
    website: '',
    googleMapLink: '',
    
    // Institution Specific
    boardAffiliation: '',
    universityAffiliation: '',
    gradesOffered: [],
    mediumOfInstruction: '',
    coursesOffered: [],
    accreditation: '',
    subjectsOffered: [],
    targetExams: [],
    batchSizes: '',
    
    // Academic Details
    studentStrength: '',
    teacherStrength: '',
    studentTeacherRatio: '',
    facilities: [],
    teachingMethodology: '',
    specialPrograms: '',
    achievements: '',
    
    // Contact Information
    principalName: '',
    contactPerson: '',
    alternatePhone: '',
    officeHours: '',
    operatingHours: '',
    
    // Fee Structure
    annualFee: '',
    admissionFee: '',
    tuitionFee: '',
    transportFee: '',
    otherFees: '',
    feePaymentOptions: '',
    scholarshipInfo: '',
    
    // Documents
    registrationCertificate: null,
    affiliationCertificate: null,
    photos: [],
    otherDocuments: [],
    
    // Social Media
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    linkedin: ''
  });

  const institutionTypes = [
    { value: 'school', label: 'School', icon: <FaSchool /> },
    { value: 'college', label: 'College', icon: <FaUniversity /> },
    { value: 'pu_college', label: 'PU College', icon: <FaGraduationCap /> },
    { value: 'coaching', label: 'Coaching Center', icon: <FaChalkboardTeacher /> },
    { value: 'tuition', label: 'Tuition Center', icon: <FaChalkboard /> }
  ];

  const boards = [
    'CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE', 
    'CIE', 'NIOS', 'Other'
  ];

  const universities = [
    'State University', 'Central University', 'Deemed University',
    'Private University', 'Autonomous College', 'Other'
  ];

  const schoolGrades = ['Nursery', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
  const collegeCourses = ['Arts', 'Science', 'Commerce', 'Engineering', 'Medical', 'Law', 'Management', 'Other'];
  const puCourses = ['PCMB', 'PCMC', 'PCME', 'CEBA', 'SEBA', 'PEBA', 'Other'];
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Social Studies', 'Languages', 'Other'];
  const targetExams = ['JEE', 'NEET', 'KCET', 'UPSC', 'GATE', 'CAT', 'Board Exams', 'Other'];
  const feePaymentOptions = ['Annual', 'Semi-Annual', 'Quarterly', 'Monthly', 'One-Time'];

  const facilities = [
    { name: 'Smart Classes', icon: <FaLaptop /> },
    { name: 'Library', icon: <FaBook /> },
    { name: 'Science Lab', icon: <FaFlask /> },
    { name: 'Computer Lab', icon: <FaLaptop /> },
    { name: 'Playground', icon: <FaRunning /> },
    { name: 'Swimming Pool', icon: <FaSwimmingPool /> },
    { name: 'Auditorium', icon: <FaTheaterMasks /> },
    { name: 'Cafeteria', icon: <FaUtensils /> },
    { name: 'Transportation', icon: <FaBus /> },
    { name: 'Medical Facility', icon: <FaFirstAid /> },
    { name: 'Sports Complex', icon: <FaRunning /> },
    { name: 'Hostel', icon: <FaHome /> },
    { name: 'Music Room', icon: <FaMusic /> },
    { name: 'Art Room', icon: <FaPaintBrush /> },
    { name: 'Dance Studio', icon: <FaTheaterMasks /> },
    { name: 'STEM Lab', icon: <FaMicroscope /> },
    { name: 'Wi-Fi Campus', icon: <FaWifi /> }
  ];

  const [dynamicFields, setDynamicFields] = useState({});

  useEffect(() => {
    // Set dynamic fields based on institution type
    if (formData.institutionType === 'school' || formData.institutionType === 'pu_college') {
      setDynamicFields({
        boardAffiliation: '',
        gradesOffered: [],
        mediumOfInstruction: ''
      });
    } else if (formData.institutionType === 'college') {
      setDynamicFields({
        universityAffiliation: '',
        coursesOffered: [],
        accreditation: ''
      });
    } else if (formData.institutionType === 'coaching' || formData.institutionType === 'tuition') {
      setDynamicFields({
        subjectsOffered: [],
        targetExams: [],
        batchSizes: ''
      });
    }
  }, [formData.institutionType]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'gradesOffered' || name === 'facilities' || 
          name === 'coursesOffered' || name === 'subjectsOffered' || 
          name === 'targetExams') {
        setFormData(prev => ({
          ...prev,
          [name]: checked 
            ? [...prev[name], value]
            : prev[name].filter(item => item !== value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDynamicChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setDynamicFields(prev => ({
        ...prev,
        [name]: checked 
          ? [...prev[name], value]
          : prev[name].filter(item => item !== value)
      }));
    } else {
      setDynamicFields(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const handleMultiFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: [...prev[name], ...files]
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const completeFormData = { ...formData, ...dynamicFields };
    console.log('Form submitted:', completeFormData);
    // Here you would typically send the data to your backend
    navigate('/registration-success');
  };

  const StepIndicator = () => (
    <div className="flex justify-center mb-8">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center">
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center 
              ${currentStep === step ? 'bg-orange-600 text-white' : 
                currentStep > step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {currentStep > step ? <FaCheck /> : step}
          </div>
          {step < 5 && (
            <div className={`w-16 h-1 ${currentStep > step ? 'bg-green-500' : 'bg-gray-200'}`}></div>
          )}
        </div>
      ))}
    </div>
  );

  const renderInstitutionTypeFields = () => {
    switch(formData.institutionType) {
      case 'school':
      case 'pu_college':
        return (
          <>
            <div>
              <label className="block text-gray-700 mb-2">Board Affiliation*</label>
              <select
                name="boardAffiliation"
                value={dynamicFields.boardAffiliation || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Select Board</option>
                {boards.map(board => (
                  <option key={board} value={board}>{board}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">
                {formData.institutionType === 'school' ? 'Grades Offered*' : 'Courses Offered*'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {(formData.institutionType === 'school' ? schoolGrades : puCourses).map(item => (
                  <label key={item} className="flex items-center">
                    <input
                      type="checkbox"
                      name={formData.institutionType === 'school' ? 'gradesOffered' : 'coursesOffered'}
                      value={item}
                      checked={
                        formData.institutionType === 'school' 
                          ? dynamicFields.gradesOffered?.includes(item)
                          : dynamicFields.coursesOffered?.includes(item)
                      }
                      onChange={handleDynamicChange}
                      className="mr-2 h-5 w-5 text-orange-600 rounded focus:ring-orange-500"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Medium of Instruction*</label>
              <select
                name="mediumOfInstruction"
                value={dynamicFields.mediumOfInstruction || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Select Medium</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Regional">Regional Language</option>
                <option value="Bilingual">Bilingual</option>
              </select>
            </div>
          </>
        );
      
      case 'college':
        return (
          <>
            <div>
              <label className="block text-gray-700 mb-2">University Affiliation*</label>
              <select
                name="universityAffiliation"
                value={dynamicFields.universityAffiliation || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Select University</option>
                {universities.map(univ => (
                  <option key={univ} value={univ}>{univ}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Courses Offered*</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {collegeCourses.map(course => (
                  <label key={course} className="flex items-center">
                    <input
                      type="checkbox"
                      name="coursesOffered"
                      value={course}
                      checked={dynamicFields.coursesOffered?.includes(course)}
                      onChange={handleDynamicChange}
                      className="mr-2 h-5 w-5 text-orange-600 rounded focus:ring-orange-500"
                    />
                    {course}
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Accreditation</label>
              <input
                type="text"
                name="accreditation"
                value={dynamicFields.accreditation || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., NAAC A+"
              />
            </div>
          </>
        );
      
      case 'coaching':
      case 'tuition':
        return (
          <>
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Subjects Offered*</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {subjects.map(subject => (
                  <label key={subject} className="flex items-center">
                    <input
                      type="checkbox"
                      name="subjectsOffered"
                      value={subject}
                      checked={dynamicFields.subjectsOffered?.includes(subject)}
                      onChange={handleDynamicChange}
                      className="mr-2 h-5 w-5 text-orange-600 rounded focus:ring-orange-500"
                    />
                    {subject}
                  </label>
                ))}
              </div>
            </div>
            
            {formData.institutionType === 'coaching' && (
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Target Exams</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {targetExams.map(exam => (
                    <label key={exam} className="flex items-center">
                      <input
                        type="checkbox"
                        name="targetExams"
                        value={exam}
                        checked={dynamicFields.targetExams?.includes(exam)}
                        onChange={handleDynamicChange}
                        className="mr-2 h-5 w-5 text-orange-600 rounded focus:ring-orange-500"
                      />
                      {exam}
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-gray-700 mb-2">Average Batch Size</label>
              <input
                type="text"
                name="batchSizes"
                value={dynamicFields.batchSizes || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 20-30 students"
              />
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <motion.button
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition"
        >
          <FaHome className="text-xl" />
          <span className="font-medium">Back to Home</span>
        </motion.button>
      </div>
      
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-6 px-8 text-center relative">
          <h1 className="text-3xl font-bold mb-2">Register Your Institution</h1>
          <p className="text-lg">Join our network of premium educational institutions</p>
        </div>

        <div className="px-8 pt-6">
          <StepIndicator />
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
                <FaSchool className="mr-2 text-orange-600" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Institution Type*</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {institutionTypes.map(type => (
                      <label 
                        key={type.value}
                        className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                          ${formData.institutionType === type.value 
                            ? 'border-orange-600 bg-orange-50' 
                            : 'border-gray-200 hover:border-orange-300'}`}
                      >
                        <input
                          type="radio"
                          name="institutionType"
                          value={type.value}
                          checked={formData.institutionType === type.value}
                          onChange={handleChange}
                          className="hidden"
                          required
                        />
                        <span className="text-2xl mb-2 text-orange-600">
                          {type.icon}
                        </span>
                        <span className="font-medium text-gray-700">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Institution Name*</label>
                  <input
                    type="text"
                    name="institutionName"
                    value={formData.institutionName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., New Horizon International School"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Tagline</label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Excellence in Education"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Year Established*</label>
                  <input
                    type="number"
                    name="establishedYear"
                    value={formData.establishedYear}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., 2005"
                    required
                  />
                </div>
                
                {formData.institutionType && renderInstitutionTypeFields()}
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">About Institution</label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows="3"
                    placeholder="Brief description about your institution"
                  ></textarea>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Address*</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Full address including landmark"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">City*</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">State*</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Pincode*</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Google Maps Link</label>
                  <input
                    type="url"
                    name="googleMapLink"
                    value={formData.googleMapLink}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Paste Google Maps URL"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Academic Details */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
                <FaBookOpen className="mr-2 text-orange-600" />
                Academic Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Approx. Student Strength</label>
                  <input
                    type="number"
                    name="studentStrength"
                    value={formData.studentStrength}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., 1200"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Approx. Teacher/Faculty Strength</label>
                  <input
                    type="number"
                    name="teacherStrength"
                    value={formData.teacherStrength}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., 60"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Student-Teacher Ratio</label>
                  <input
                    type="text"
                    name="studentTeacherRatio"
                    value={formData.studentTeacherRatio}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., 20:1"
                  />
                </div>
                
                {formData.institutionType === 'college' && (
                  <div>
                    <label className="block text-gray-700 mb-2">Number of Departments</label>
                    <input
                      type="number"
                      name="departments"
                      value={formData.departments || ''}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 8"
                    />
                  </div>
                )}
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Facilities Available</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {facilities.map(facility => (
                      <label key={facility.name} className="flex items-center">
                        <input
                          type="checkbox"
                          name="facilities"
                          value={facility.name}
                          checked={formData.facilities.includes(facility.name)}
                          onChange={handleChange}
                          className="mr-2 h-5 w-5 text-orange-600 rounded focus:ring-orange-500"
                        />
                        <span className="flex items-center">
                          <span className="mr-1 text-orange-500">{facility.icon}</span>
                          {facility.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {formData.institutionType === 'coaching' || formData.institutionType === 'tuition' ? (
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Teaching Methodology</label>
                    <textarea
                      name="teachingMethodology"
                      value={formData.teachingMethodology || ''}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      rows="3"
                      placeholder="Describe your teaching approach, class structure, etc."
                    ></textarea>
                  </div>
                ) : (
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Special Programs</label>
                    <textarea
                      name="specialPrograms"
                      value={formData.specialPrograms || ''}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      rows="3"
                      placeholder="Any special programs, extracurricular activities, etc."
                    ></textarea>
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Notable Achievements</label>
                  <textarea
                    name="achievements"
                    value={formData.achievements || ''}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows="3"
                    placeholder="Any awards, rankings, or notable achievements"
                  ></textarea>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Fee Structure */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
                <GiMoneyStack className="mr-2 text-orange-600" />
                Fee Structure
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Total Annual Fee</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaRupeeSign className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      name="annualFee"
                      value={formData.annualFee}
                      onChange={handleChange}
                      className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 1,54,000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Admission Fee</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaRupeeSign className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      name="admissionFee"
                      value={formData.admissionFee}
                      onChange={handleChange}
                      className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 25,000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Tuition Fee</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaRupeeSign className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      name="tuitionFee"
                      value={formData.tuitionFee}
                      onChange={handleChange}
                      className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 1,00,000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Transport Fee (if applicable)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaRupeeSign className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      name="transportFee"
                      value={formData.transportFee}
                      onChange={handleChange}
                      className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 15,000"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Other Fees (Books, Uniforms, etc.)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaRupeeSign className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      name="otherFees"
                      value={formData.otherFees}
                      onChange={handleChange}
                      className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 14,000"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Fee Payment Options</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {feePaymentOptions.map(option => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          name="feePaymentOptions"
                          value={option}
                          checked={formData.feePaymentOptions?.includes(option)}
                          onChange={handleChange}
                          className="mr-2 h-5 w-5 text-orange-600 rounded focus:ring-orange-500"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Scholarship Information</label>
                  <textarea
                    name="scholarshipInfo"
                    value={formData.scholarshipInfo || ''}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows="3"
                    placeholder="Details about scholarships, discounts, or financial aid"
                  ></textarea>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Contact Information */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
                <FaPhone className="mr-2 text-orange-600" />
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">
                    {formData.institutionType === 'college' ? 'Principal/Director Name*' : 
                     formData.institutionType === 'coaching' || formData.institutionType === 'tuition' ? 
                     'Owner/Manager Name*' : 'Principal Name*'}
                  </label>
                  <input
                    type="text"
                    name="principalName"
                    value={formData.principalName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Contact Person*</label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Phone*</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="https://www.yourschool.edu"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Alternate Phone</label>
                  <input
                    type="tel"
                    name="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Social Media Links</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="url"
                        name="facebook"
                        value={formData.facebook}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Facebook URL"
                      />
                    </div>
                    <div className="flex items-center">
                      <div className="bg-sky-100 p-2 rounded-full mr-3">
                        <svg className="w-5 h-5 text-sky-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </div>
                      <input
                        type="url"
                        name="twitter"
                        value={formData.twitter}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Twitter URL"
                      />
                    </div>
                    <div className="flex items-center">
                      <div className="bg-pink-100 p-2 rounded-full mr-3">
                        <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="url"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Instagram URL"
                      />
                    </div>
                    <div className="flex items-center">
                      <div className="bg-red-100 p-2 rounded-full mr-3">
                        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                        </svg>
                      </div>
                      <input
                        type="url"
                        name="youtube"
                        value={formData.youtube}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="YouTube URL"
                      />
                    </div>
                  </div>
                </div>
                
                {formData.institutionType === 'coaching' || formData.institutionType === 'tuition' ? (
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Operating Hours</label>
                    <input
                      type="text"
                      name="operatingHours"
                      value={formData.operatingHours || ''}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 8 AM - 8 PM, Monday-Saturday"
                    />
                  </div>
                ) : (
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Office Hours</label>
                    <input
                      type="text"
                      name="officeHours"
                      value={formData.officeHours || ''}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 9 AM - 5 PM, Monday-Friday"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 5: Documents */}
          {currentStep === 5 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
                <FaClipboardList className="mr-2 text-orange-600" />
                Required Documents
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2">Registration Certificate*</label>
                  <div className="flex items-center">
                    <label className="cursor-pointer bg-orange-100 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-200 transition">
                      <input
                        type="file"
                        name="registrationCertificate"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        required
                      />
                      Choose File
                    </label>
                    {formData.registrationCertificate && (
                      <span className="ml-3 text-gray-700">
                        {formData.registrationCertificate.name}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Upload scanned copy of your institution's registration certificate</p>
                </div>
                
                {(formData.institutionType === 'school' || formData.institutionType === 'pu_college' || 
                  formData.institutionType === 'college') && (
                  <div>
                    <label className="block text-gray-700 mb-2">
                      {formData.institutionType === 'college' ? 'University Affiliation Certificate' : 'Board Affiliation Certificate'}*
                    </label>
                    <div className="flex items-center">
                      <label className="cursor-pointer bg-orange-100 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-200 transition">
                        <input
                          type="file"
                          name="affiliationCertificate"
                          onChange={handleFileChange}
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          required
                        />
                        Choose File
                      </label>
                      {formData.affiliationCertificate && (
                        <span className="ml-3 text-gray-700">
                          {formData.affiliationCertificate.name}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.institutionType === 'college' ? 
                        'Upload scanned copy of university affiliation certificate' : 
                        'Upload scanned copy of board affiliation certificate'}
                    </p>
                  </div>
                )}
                
                <div>
                  <label className="block text-gray-700 mb-2">Institution Photos (Min 3)*</label>
                  <div className="flex items-center">
                    <label className="cursor-pointer bg-orange-100 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-200 transition">
                      <input
                        type="file"
                        name="photos"
                        onChange={handleMultiFileChange}
                        className="hidden"
                        accept=".jpg,.jpeg,.png"
                        multiple
                        required
                      />
                      Choose Files
                    </label>
                    {formData.photos.length > 0 && (
                      <span className="ml-3 text-gray-700">
                        {formData.photos.length} files selected
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Upload high-quality photos of {formData.institutionType === 'college' ? 'campus, labs, library' : 
                    formData.institutionType === 'coaching' || formData.institutionType === 'tuition' ? 
                    'center, classrooms, facilities' : 'campus, classrooms, facilities'} (JPEG/PNG)
                  </p>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Other Documents (Optional)</label>
                  <div className="flex items-center">
                    <label className="cursor-pointer bg-orange-100 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-200 transition">
                      <input
                        type="file"
                        name="otherDocuments"
                        onChange={handleMultiFileChange}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple
                      />
                      Choose Files
                    </label>
                    {formData.otherDocuments.length > 0 && (
                      <span className="ml-3 text-gray-700">
                        {formData.otherDocuments.length} files selected
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.institutionType === 'college' ? 'NAAC certificate, department approvals, etc.' : 
                    formData.institutionType === 'coaching' || formData.institutionType === 'tuition' ? 
                    'Success stories, testimonials, etc.' : 'Achievements, awards, etc.'} (PDF/JPEG/PNG)
                  </p>
                </div>
                
                <div className="mt-6">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 mr-2 h-5 w-5 text-orange-600 rounded focus:ring-orange-500"
                      required
                    />
                    <span className="text-gray-700">
                      I certify that all information provided is accurate and I agree to the 
                      <a href="/terms" className="text-orange-600 hover:underline ml-1">Terms of Service</a>
                    </span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {currentStep > 1 && (
              <motion.button
                type="button"
                onClick={prevStep}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition"
              >
                Back
              </motion.button>
            )}
            
            {currentStep < 5 ? (
              <motion.button
                type="button"
                onClick={nextStep}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="ml-auto bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-orange-700 transition"
              >
                Next
              </motion.button>
            ) : (
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="ml-auto bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition"
              >
                Submit Registration
              </motion.button>
            )}
          </div>
        </form>
      </div>
      {/* <Footer/> */}
    </div>
  );
};

export default RegisterForm;