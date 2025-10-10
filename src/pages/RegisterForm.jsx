import React, { useState, useEffect } from 'react';
import "tailwindcss";
import { motion } from 'framer-motion';
import { 
  FaSchool, FaChalkboardTeacher, FaMapMarkerAlt, FaPhone, FaEnvelope, 
  FaUserTie, FaBookOpen, FaCheck, FaHome, FaUniversity, FaGraduationCap, 
  FaUserGraduate, FaChalkboard, FaRupeeSign, FaFlask, FaBook, 
  FaRunning, FaTheaterMasks, FaVideo, FaFirstAid, FaWifi, FaLink, 
  FaClipboardList, FaStar, FaCalendarAlt, FaUsers, FaBus, FaUtensils,
  FaSwimmingPool, FaLaptop, FaMicroscope, FaMusic, FaPaintBrush,
  FaUser, FaCertificate, FaAward, FaGlobe, FaFacebook, FaTwitter, FaInstagram, FaLinkedin
} from 'react-icons/fa';
import { GiMoneyStack, GiTeacher } from 'react-icons/gi';
import { IoMdTime } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { registerApi } from '../services/RegisterApi';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    institutionType: '',
    teacherType: '',
    name: '',
    tagline: '',
    establishmentYear: '',
    about: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    email: '',
    phone: '',
    website: '',
    googleMapsEmbedUrl: '',
    facilities: [],
    typeOfSchool: '',
    affiliation: '',
    grade: '',
    ageForAdmission: '',
    language: '',
    studentStrength: '',
    teacherStrength: '',
    studentTeacherRatio: '',
    typeOfCollege: '',
    universityAffiliation: '',
    coursesOffered: '',
    duration: '',
    accreditation: '',
    placementStatistics: '',
    departments: '',
    board: '',
    streams: '',
    subjects: '',
    programDuration: '',
    competitiveExamPrep: '',
    typeOfCoaching: '',
    classes: '',
    batchSize: '',
    classDuration: '',
    faculty: '',
    studyMaterial: '',
    tests: '',
    doubtSessions: '',
    infrastructure: '',
    demoClass: '',
    flexibleTimings: '',
    teacherName: '',
    qualifications: '',
    experience: '',
    teachingMode: '',
    languages: '',
    specialization: '',
    certifications: '',
    availability: '',
    hourlyRate: '',
    monthlyPackage: '',
    examPreparation: '',
    demoFee: '',
    teachingApproach: '',
    studyMaterials: '',
    sessionDuration: '',
    studentLevel: '',
    classSize: '',
    onlinePlatform: '',
    progressReports: '',
    performanceTracking: '',
    teachingProcess: '',
    institutionName: '',
    institutionPosition: '',
    institutionExperience: '',
    totalAnnualFee: '',
    admissionFee: '',
    tuitionFee: '',
    transportFee: '',
    booksUniformsFee: '',
    principalName: '',
    contactPerson: '',
    alternatePhone: '',
    officeHours: '',
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    },
    campusSize: '',
    classrooms: '',
    laboratories: '',
    library: '',
    playground: '',
    auditorium: '',
    smartBoards: '',
    cctv: '',
    medicalRoom: '',
    wifi: '',
    hostel: '',
    sports: '',
    admissionLink: '',
    admissionProcess: '',
    registrationCertificate: null,
    affiliationNumber: '',
    qualificationCertificates: [],
    idProof: null,
    profileImage: null,
    photos: [],
    otherDocuments: []
  });

  const institutionTypes = [
    { value: 'school', label: 'School', icon: <FaSchool /> },
    { value: 'college', label: 'College', icon: <FaUniversity /> },
    { value: 'pu_college', label: 'PU College', icon: <FaGraduationCap /> },
    { value: 'coaching', label: 'Coaching / Tuition Center', icon: <FaChalkboardTeacher /> },
    { value: 'teacher', label: 'Teacher', icon: <GiTeacher /> }
  ];

  const teacherTypes = [
    { value: 'institutional', label: 'Professional in School/College/Coaching', description: 'I work with an educational institution' },
    { value: 'personal', label: 'Personal Mentor/Tutor', description: 'I teach independently' }
  ];

  const cities = ['Bangalore', 'Hyderabad', 'Mumbai', 'Kolkata', 'Delhi', 'Chennai'];
  const schoolTypes = ['Day School', 'Boarding', 'Pre School', 'International School'];
  const collegeTypes = ['Engineering', 'Medical', 'Arts & Science', 'Management', 'Law', 'Other'];
  const coachingTypes = ['Academic', 'Competitive Exams', 'Skill Development', 'Language', 'Other'];
  const affiliations = ['CBSE', 'ICSE', 'State Board', 'International'];
  const boards = ['State Board', 'CBSE', 'ICSE', 'International Baccalaureate'];

  const facilities = [
    'Smart Classes', 'Library', 'Science Lab', 'Computer Lab', 'Playground', 
    'Swimming Pool', 'Auditorium', 'Cafeteria', 'Transportation', 'Medical Facility',
    'Sports Complex', 'Hostel', 'Music Room', 'Art Room', 'Dance Studio', 
    'STEM Lab', 'Wi-Fi Campus', 'Individual Attention', 'Mock Tests', 'Online Classes',
    'Study Material', 'Counseling', 'Personalized Lessons', 'Progress Tracking'
  ];

  const [dynamicFields, setDynamicFields] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.institutionType === 'school') {
      setDynamicFields({
        typeOfSchool: '',
        affiliation: '',
        grade: '',
        ageForAdmission: '',
        language: '',
        studentStrength: '',
        teacherStrength: '',
        studentTeacherRatio: ''
      });
    } else if (formData.institutionType === 'college') {
      setDynamicFields({
        typeOfCollege: '',
        universityAffiliation: '',
        coursesOffered: '',
        duration: '',
        accreditation: '',
        placementStatistics: '',
        departments: ''
      });
    } else if (formData.institutionType === 'pu_college') {
      setDynamicFields({
        board: '',
        streams: '',
        subjects: '',
        programDuration: '',
        competitiveExamPrep: ''
      });
    } else if (formData.institutionType === 'coaching') {
      setDynamicFields({
        typeOfCoaching: '',
        classes: '',
        batchSize: '',
        classDuration: '',
        faculty: '',
        studyMaterial: '',
        tests: '',
        doubtSessions: '',
        infrastructure: '',
        demoClass: '',
        flexibleTimings: ''
      });
    } else if (formData.institutionType === 'teacher') {
      setDynamicFields({
        teacherName: '',
        qualifications: '',
        experience: '',
        teachingMode: '',
        languages: '',
        specialization: '',
        certifications: '',
        availability: '',
        hourlyRate: '',
        monthlyPackage: '',
        examPreparation: '',
        demoFee: '',
        teachingApproach: '',
        studyMaterials: '',
        sessionDuration: '',
        studentLevel: '',
        classSize: '',
        onlinePlatform: '',
        progressReports: '',
        performanceTracking: '',
        teachingProcess: '',
        institutionName: '',
        institutionPosition: '',
        institutionExperience: ''
      });
    }
  }, [formData.institutionType]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'facilities') {
        setFormData(prev => ({
          ...prev,
          [name]: checked 
            ? [...prev[name], value]
            : prev[name].filter(item => item !== value)
        }));
      }
    } else if (name.includes('socialMedia.')) {
      const socialMediaField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialMedia: { ...prev.socialMedia, [socialMediaField]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDynamicChange = (e) => {
    const { name, value } = e.target;
    setDynamicFields(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      institutionType: '',
      teacherType: '',
      name: '',
      tagline: '',
      establishmentYear: '',
      about: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      email: '',
      phone: '',
      website: '',
      googleMapsEmbedUrl: '',
      facilities: [],
      typeOfSchool: '',
      affiliation: '',
      grade: '',
      ageForAdmission: '',
      language: '',
      studentStrength: '',
      teacherStrength: '',
      studentTeacherRatio: '',
      typeOfCollege: '',
      universityAffiliation: '',
      coursesOffered: '',
      duration: '',
      accreditation: '',
      placementStatistics: '',
      departments: '',
      board: '',
      streams: '',
      subjects: '',
      programDuration: '',
      competitiveExamPrep: '',
      typeOfCoaching: '',
      classes: '',
      batchSize: '',
      classDuration: '',
      faculty: '',
      studyMaterial: '',
      tests: '',
      doubtSessions: '',
      infrastructure: '',
      demoClass: '',
      flexibleTimings: '',
      teacherName: '',
      qualifications: '',
      experience: '',
      teachingMode: '',
      languages: '',
      specialization: '',
      certifications: '',
      availability: '',
      hourlyRate: '',
      monthlyPackage: '',
      examPreparation: '',
      demoFee: '',
      teachingApproach: '',
      studyMaterials: '',
      sessionDuration: '',
      studentLevel: '',
      classSize: '',
      onlinePlatform: '',
      progressReports: '',
      performanceTracking: '',
      teachingProcess: '',
      institutionName: '',
      institutionPosition: '',
      institutionExperience: '',
      totalAnnualFee: '',
      admissionFee: '',
      tuitionFee: '',
      transportFee: '',
      booksUniformsFee: '',
      principalName: '',
      contactPerson: '',
      alternatePhone: '',
      officeHours: '',
      socialMedia: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: ''
      },
      campusSize: '',
      classrooms: '',
      laboratories: '',
      library: '',
      playground: '',
      auditorium: '',
      smartBoards: '',
      cctv: '',
      medicalRoom: '',
      wifi: '',
      hostel: '',
      sports: '',
      admissionLink: '',
      admissionProcess: '',
      registrationCertificate: null,
      affiliationNumber: '',
      qualificationCertificates: [],
      idProof: null,
      profileImage: null,
      photos: [],
      otherDocuments: []
    });
    setDynamicFields({});
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const completeFormData = { ...formData, ...dynamicFields };
    const formDataToSend = new FormData();

    Object.keys(completeFormData).forEach(key => {
      if (key === 'facilities' || key === 'socialMedia' || key === 'languages' || key === 'streams' || key === 'subjects' || key === 'coursesOffered') {
        formDataToSend.append(key, JSON.stringify(completeFormData[key]));
      } else if (completeFormData[key] instanceof File) {
        formDataToSend.append(key, completeFormData[key]);
      } else if (Array.isArray(completeFormData[key]) && completeFormData[key][0] instanceof File) {
        completeFormData[key].forEach(file => {
          formDataToSend.append(key, file);
        });
      } else {
        formDataToSend.append(key, completeFormData[key]);
      }
    });

    try {
      await registerApi.submitRegistration(formDataToSend);
      setShowModal(true);
    } catch (err) {
      setError(err.message || 'An error occurred during submission');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
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

  const renderTeacherTypeFields = () => {
    if (formData.institutionType !== 'teacher') return null;

    return (
      <div className="md:col-span-2">
        <label className="block text-gray-700 mb-2">Teaching Profile Type*</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teacherTypes.map(type => (
            <label 
              key={type.value}
              className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all
                ${formData.teacherType === type.value 
                  ? 'border-orange-600 bg-orange-50' 
                  : 'border-gray-200 hover:border-orange-300'}`}
            >
              <input
                type="radio"
                name="teacherType"
                value={type.value}
                checked={formData.teacherType === type.value}
                onChange={handleChange}
                className="hidden"
                required
              />
              <span className="font-medium text-gray-700 mb-1">{type.label}</span>
              <span className="text-sm text-gray-500">{type.description}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const renderInstitutionalTeacherFields = () => {
    if (formData.teacherType !== 'institutional') return null;

    return (
      <>
        <div>
          <label className="block text-gray-700 mb-2">Institution Name*</label>
          <input
            type="text"
            name="institutionName"
            value={dynamicFields.institutionName || ''}
            onChange={handleDynamicChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="e.g., ABC International School"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Position/Role*</label>
          <input
            type="text"
            name="institutionPosition"
            value={dynamicFields.institutionPosition || ''}
            onChange={handleDynamicChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="e.g., Senior Mathematics Teacher"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Experience at Institution</label>
          <input
            type="text"
            name="institutionExperience"
            value={dynamicFields.institutionExperience || ''}
            onChange={handleDynamicChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="e.g., 5 years"
          />
        </div>
      </>
    );
  };

  const renderInstitutionTypeFields = () => {
    switch(formData.institutionType) {
      case 'school':
        return (
          <>
            <div>
              <label className="block text-gray-700 mb-2">School Type*</label>
              <select
                name="typeOfSchool"
                value={dynamicFields.typeOfSchool || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Select School Type</option>
                {schoolTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Affiliation*</label>
              <select
                name="affiliation"
                value={dynamicFields.affiliation || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Select Affiliation</option>
                {affiliations.map(affiliation => (
                  <option key={affiliation} value={affiliation}>{affiliation}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Grades Offered*</label>
              <input
                type="text"
                name="grade"
                value={dynamicFields.grade || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., Nursery to 12th"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Age for Admission</label>
              <input
                type="text"
                name="ageForAdmission"
                value={dynamicFields.ageForAdmission || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 3 Years"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Language of Instruction</label>
              <input
                type="text"
                name="language"
                value={dynamicFields.language || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., English"
              />
            </div>
          </>
        );
      
      case 'college':
        return (
          <>
            <div>
              <label className="block text-gray-700 mb-2">College Type*</label>
              <select
                name="typeOfCollege"
                value={dynamicFields.typeOfCollege || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Select College Type</option>
                {collegeTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">University Affiliation*</label>
              <input
                type="text"
                name="universityAffiliation"
                value={dynamicFields.universityAffiliation || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., VTU"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Courses Offered*</label>
              <input
                type="text"
                name="coursesOffered"
                value={dynamicFields.coursesOffered || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., B.Tech, MBA, B.Sc"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Duration</label>
              <input
                type="text"
                name="duration"
                value={dynamicFields.duration || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 4 Years for B.Tech"
              />
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
            
            <div>
              <label className="block text-gray-700 mb-2">Placement Statistics</label>
              <input
                type="text"
                name="placementStatistics"
                value={dynamicFields.placementStatistics || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 90%"
              />
            </div>
          </>
        );
      
      case 'pu_college':
        return (
          <>
            <div>
              <label className="block text-gray-700 mb-2">Board*</label>
              <select
                name="board"
                value={dynamicFields.board || ''}
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
            
            <div>
              <label className="block text-gray-700 mb-2">Streams Offered*</label>
              <input
                type="text"
                name="streams"
                value={dynamicFields.streams || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., Science, Commerce, Arts"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Subjects Offered*</label>
              <input
                type="text"
                name="subjects"
                value={dynamicFields.subjects || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., Physics, Chemistry, Mathematics"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Program Duration</label>
              <input
                type="text"
                name="programDuration"
                value={dynamicFields.programDuration || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 2 Years"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Competitive Exam Prep</label>
              <input
                type="text"
                name="competitiveExamPrep"
                value={dynamicFields.competitiveExamPrep || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., JEE, NEET"
              />
            </div>
          </>
        );
      
      case 'coaching':
        return (
          <>
            <div>
              <label className="block text-gray-700 mb-2">Coaching Type*</label>
              <select
                name="typeOfCoaching"
                value={dynamicFields.typeOfCoaching || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Select Coaching Type</option>
                {coachingTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Classes Covered*</label>
              <input
                type="text"
                name="classes"
                value={dynamicFields.classes || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 1st to 12th"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Batch Size</label>
              <input
                type="text"
                name="batchSize"
                value={dynamicFields.batchSize || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 5-8 students per batch"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Class Duration</label>
              <input
                type="text"
                name="classDuration"
                value={dynamicFields.classDuration || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 1-2 hours per session"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Faculty</label>
              <input
                type="text"
                name="faculty"
                value={dynamicFields.faculty || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., Experienced Teachers"
              />
            </div>
          </>
        );

      case 'teacher':
        return (
          <>
            {renderTeacherTypeFields()}
            {renderInstitutionalTeacherFields()}
            
            <div>
              <label className="block text-gray-700 mb-2">Full Name*</label>
              <input
                type="text"
                name="teacherName"
                value={dynamicFields.teacherName || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., Dr. Priya Sharma"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Qualifications*</label>
              <input
                type="text"
                name="qualifications"
                value={dynamicFields.qualifications || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., PhD in Mathematics, M.Ed"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Experience*</label>
              <input
                type="text"
                name="experience"
                value={dynamicFields.experience || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., 12 years"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Teaching Mode</label>
              <input
                type="text"
                name="teachingMode"
                value={dynamicFields.teachingMode || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., Online, Offline"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Languages</label>
              <input
                type="text"
                name="languages"
                value={dynamicFields.languages || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., English, Hindi, Kannada"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Specialization*</label>
              <input
                type="text"
                name="specialization"
                value={dynamicFields.specialization || ''}
                onChange={handleDynamicChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., Board Exam Preparation, IIT-JEE"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Hourly Rate</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaRupeeSign className="text-gray-500" />
                </div>
                <input
                  type="text"
                  name="hourlyRate"
                  value={dynamicFields.hourlyRate || ''}
                  onChange={handleDynamicChange}
                  className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., ₹800 - ₹1200/hr"
                />
              </div>
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
          <h1 className="text-3xl font-bold mb-2">Register Your {formData.institutionType === 'teacher' ? 'Teaching Profile' : 'Institution'}</h1>
          <p className="text-lg">Join our network of premium {formData.institutionType === 'teacher' ? 'educators' : 'educational institutions'}</p>
        </div>

        <div className="px-8 pt-6">
          <StepIndicator />
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
              {error}
            </div>
          )}
          {loading && (
            <div className="text-center text-orange-600 mb-6">
              Submitting your registration...
            </div>
          )}
        </div>

        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-green-600 mb-4 flex items-center">
                <FaCheck className="mr-2" /> Registration Successful
              </h2>
              <p className="text-gray-700 mb-6">
                Successfully completed the registration. We will contact you soon!
              </p>
              <motion.button
                onClick={handleCloseModal}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-700 transition"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="px-8 pb-8">
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
                {formData.institutionType === 'teacher' ? (
                  <GiTeacher className="mr-2 text-orange-600" />
                ) : (
                  <FaSchool className="mr-2 text-orange-600" />
                )}
                {formData.institutionType === 'teacher' ? 'Teacher Information' : 'Basic Information'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Type*</label>
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
                
                {formData.institutionType === 'teacher' ? (
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Full Name*</label>
                    <input
                      type="text"
                      name="teacherName"
                      value={dynamicFields.teacherName || ''}
                      onChange={handleDynamicChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., Dr. Priya Sharma"
                      required
                    />
                  </div>
                ) : (
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">
                      {formData.institutionType === 'school' ? 'School Name*' : 
                       formData.institutionType === 'college' ? 'College Name*' :
                       formData.institutionType === 'pu_college' ? 'PU College Name*' : 'Center Name*'}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder={`e.g., ${formData.institutionType === 'school' ? 'New Horizon International School' : 
                        formData.institutionType === 'college' ? 'ABC Engineering College' :
                        formData.institutionType === 'pu_college' ? 'XYZ PU College' : 'Bright Future Coaching Center'}`}
                      required
                    />
                  </div>
                )}

                {formData.institutionType !== 'teacher' && (
                  <>
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
                      <label className="block text-gray-700 mb-2">
                        {formData.institutionType === 'teacher' ? 'Teaching Since' : 'Year Established*'}
                      </label>
                      <input
                        type="number"
                        name="establishmentYear"
                        value={formData.establishmentYear}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder={formData.institutionType === 'teacher' ? "e.g., 2015" : "e.g., 2005"}
                        required
                      />
                    </div>
                  </>
                )}
                
                {formData.institutionType && renderInstitutionTypeFields()}
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">
                    {formData.institutionType === 'teacher' ? 'About You' : 'About Institution'}
                  </label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows="3"
                    placeholder={formData.institutionType === 'teacher' ? 
                      "Brief description about your teaching experience and philosophy" : 
                      "Brief description about your institution"}
                  ></textarea>
                </div>
                
                {formData.institutionType !== 'teacher' && (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 mb-2">Address*</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Full address "
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">City*</label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      >
                        <option value="">Select City</option>
                        {cities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
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
                      <label className="block text-gray-700 mb-2">Google Maps Embed URL</label>
                      <input
                        type="url"
                        name="googleMapsEmbedUrl"
                        value={formData.googleMapsEmbedUrl}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Paste Google Maps Embed URL"
                      />
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
                {formData.institutionType === 'teacher' ? (
                  <FaUserGraduate className="mr-2 text-orange-600" />
                ) : (
                  <FaBookOpen className="mr-2 text-orange-600" />
                )}
                {formData.institutionType === 'teacher' ? 'Teaching Details' : 'Additional Details'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.institutionType === 'teacher' ? (
                  <>
                    <div>
                      <label className="block text-gray-700 mb-2">Monthly Package</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaRupeeSign className="text-gray-500" />
                        </div>
                        <input
                          type="text"
                          name="monthlyPackage"
                          value={dynamicFields.monthlyPackage || ''}
                          onChange={handleDynamicChange}
                          className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="e.g., ₹15,000 - ₹20,000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Exam Preparation Fee</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaRupeeSign className="text-gray-500" />
                        </div>
                        <input
                          type="text"
                          name="examPreparation"
                          value={dynamicFields.examPreparation || ''}
                          onChange={handleDynamicChange}
                          className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="e.g., ₹25,000 for 3 months"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Demo Class Fee</label>
                      <input
                        type="text"
                        name="demoFee"
                        value={dynamicFields.demoFee || ''}
                        onChange={handleDynamicChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g., Free"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Teaching Approach</label>
                      <input
                        type="text"
                        name="teachingApproach"
                        value={dynamicFields.teachingApproach || ''}
                        onChange={handleDynamicChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g., Conceptual & Practical"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Study Materials</label>
                      <input
                        type="text"
                        name="studyMaterials"
                        value={dynamicFields.studyMaterials || ''}
                        onChange={handleDynamicChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g., Digital & Print"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Session Duration</label>
                      <input
                        type="text"
                        name="sessionDuration"
                        value={dynamicFields.sessionDuration || ''}
                        onChange={handleDynamicChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g., 60-90 minutes"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Student Level</label>
                      <input
                        type="text"
                        name="studentLevel"
                        value={dynamicFields.studentLevel || ''}
                        onChange={handleDynamicChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g., Grade 6 to 12"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Class Size</label>
                      <input
                        type="text"
                        name="classSize"
                        value={dynamicFields.classSize || ''}
                        onChange={handleDynamicChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g., 1:1 or Small Groups"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-gray-700 mb-2">Teaching Process</label>
                      <textarea
                        name="teachingProcess"
                        value={dynamicFields.teachingProcess || ''}
                        onChange={handleDynamicChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        rows="3"
                        placeholder="Describe your teaching process and methodology"
                      ></textarea>
                    </div>
                  </>
                ) : (
                  <>
                    {formData.institutionType === 'school' && (
                      <>
                        <div>
                          <label className="block text-gray-700 mb-2">Approx. Student Strength</label>
                          <input
                            type="number"
                            name="studentStrength"
                            value={dynamicFields.studentStrength || ''}
                            onChange={handleDynamicChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="e.g., 1200"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 mb-2">Approx. Teacher Strength</label>
                          <input
                            type="number"
                            name="teacherStrength"
                            value={dynamicFields.teacherStrength || ''}
                            onChange={handleDynamicChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="e.g., 60"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 mb-2">Student-Teacher Ratio</label>
                          <input
                            type="text"
                            name="studentTeacherRatio"
                            value={dynamicFields.studentTeacherRatio || ''}
                            onChange={handleDynamicChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="e.g., 20:1"
                          />
                        </div>
                      </>
                    )}

                    {formData.institutionType === 'college' && (
                      <div>
                        <label className="block text-gray-700 mb-2">Number of Departments</label>
                        <input
                          type="number"
                          name="departments"
                          value={dynamicFields.departments || ''}
                          onChange={handleDynamicChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="e.g., 8"
                        />
                      </div>
                    )}
                    
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 mb-2">Facilities Available</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {facilities.map(facility => (
                          <label key={facility} className="flex items-center">
                            <input
                              type="checkbox"
                              name="facilities"
                              value={facility}
                              checked={formData.facilities.includes(facility)}
                              onChange={handleChange}
                              className="mr-2 h-5 w-5 text-orange-600 rounded focus:ring-orange-500"
                            />
                            {facility}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-gray-700 mb-2">Infrastructure Details</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['campusSize', 'classrooms'].map(field => (
                          <div key={field}>
                            <label className="block text-gray-700 mb-2 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                            <input
                              type="text"
                              name={field}
                              value={formData[field] || ''}
                              onChange={handleChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder={`e.g., ${field === 'campusSize' ? '10 acres' : field === 'classrooms' ? '50' : field === 'laboratories' ? '5' : 'Available'}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {currentStep === 3 && formData.institutionType !== 'teacher' && (
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
                      {/* <FaRupeeSign className="text-gray-500" /> */}
                    </div>
                    <input
                      type="text"
                      name="totalAnnualFee"
                      value={formData.totalAnnualFee}
                      onChange={handleChange}
                      className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., ₹1,54,000/year"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Admission Fee</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {/* <FaRupeeSign className="text-gray-500" /> */}
                    </div>
                    <input
                      type="text"
                      name="admissionFee"
                      value={formData.admissionFee}
                      onChange={handleChange}
                      className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., ₹25,000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Tuition Fee</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {/* <FaRupeeSign className="text-gray-500" /> */}
                    </div>
                    <input
                      type="text"
                      name="tuitionFee"
                      value={formData.tuitionFee}
                      onChange={handleChange}
                      className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., ₹1,00,000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Transport Fee</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {/* <FaRupeeSign className="text-gray-500" /> */}
                    </div>
                    <input
                      type="text"
                      name="transportFee"
                      value={formData.transportFee}
                      onChange={handleChange}
                      className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., ₹15,000"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Books & Uniforms/Materials Fee</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {/* <FaRupeeSign className="text-gray-500" /> */}
                    </div>
                    <input
                      type="text"
                      name="booksUniformsFee"
                      value={formData.booksUniformsFee}
                      onChange={handleChange}
                      className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., ₹14,000"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === (formData.institutionType === 'teacher' ? 3 : 4) && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {formData.institutionType !== 'teacher' && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
                    <FaLink className="mr-2 text-orange-600" />
                    Admission Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 mb-2">Admission Link</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          {/* <FaLink className="text-gray-500" /> */}
                        </div>
                        <input
                          type="url"
                          name="admissionLink"
                          value={formData.admissionLink}
                          onChange={handleChange}
                          className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="e.g., https://www.example.com/admissions"
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Provide the URL to your institution's admission page</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 mb-2">Admission Process</label>
                      <textarea
                        name="admissionProcess"
                        value={formData.admissionProcess}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        rows="4"
                        placeholder="Describe the admission process (e.g., application form, entrance test, interview)"
                      ></textarea>
                      <p className="text-sm text-gray-500 mt-1">Provide a detailed description of the steps for admission</p>
                    </div>
                  </div>
                </div>
              )}

              <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
                <FaPhone className="mr-2 text-orange-600" />
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.institutionType === 'teacher' ? (
                  <>
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
                      <label className="block text-gray-700 mb-2">Alternate Phone</label>
                      <input
                        type="tel"
                        name="alternatePhone"
                        value={formData.alternatePhone}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-gray-700 mb-2">
                        {formData.institutionType === 'college' ? 'Principal/Director Name*' : 
                         formData.institutionType === 'coaching' ? 
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
                  </>
                )}
                
                {formData.institutionType === 'teacher' ? null : (
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
                )}
                
                {formData.institutionType === 'teacher' ? null : (
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
                )}
                
                <div>
                  <label className="block text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="https://www.example.com"
                  />
                </div>
                
                {formData.institutionType === 'teacher' ? null : (
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
                )}

                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Social Media Links</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FaFacebook className="w-5 h-5 text-blue-600" />
                      </div>
                      <input
                        type="url"
                        name="socialMedia.facebook"
                        value={formData.socialMedia.facebook}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Facebook URL"
                      />
                    </div>
                    <div className="flex items-center">
                      <div className="bg-sky-100 p-2 rounded-full mr-3">
                        <FaTwitter className="w-5 h-5 text-sky-600" />
                      </div>
                      <input
                        type="url"
                        name="socialMedia.twitter"
                        value={formData.socialMedia.twitter}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Twitter URL"
                      />
                    </div>
                    <div className="flex items-center">
                      <div className="bg-pink-100 p-2 rounded-full mr-3">
                        <FaInstagram className="w-5 h-5 text-pink-600" />
                      </div>
                      <input
                        type="url"
                        name="socialMedia.instagram"
                        value={formData.socialMedia.instagram}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Instagram URL"
                      />
                    </div>
                    <div className="flex items-center">
                      <div className="bg-blue-600 p-2 rounded-full mr-3">
                        <FaLinkedin className="w-5 h-5 text-white" />
                      </div>
                      <input
                        type="url"
                        name="socialMedia.linkedin"
                        value={formData.socialMedia.linkedin}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="LinkedIn URL"
                      />
                    </div>
                  </div>
                </div>
                
                {formData.institutionType === 'coaching' ? (
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Operating Hours</label>
                    <input
                      type="text"
                      name="officeHours"
                      value={formData.officeHours || ''}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 8 AM - 8 PM, Monday-Saturday"
                    />
                  </div>
                ) : formData.institutionType !== 'teacher' ? (
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
                ) : (
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Availability</label>
                    <input
                      type="text"
                      name="availability"
                      value={dynamicFields.availability || ''}
                      onChange={handleDynamicChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., Weekdays 4 PM - 8 PM, Weekends 10 AM - 6 PM"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {currentStep === (formData.institutionType === 'teacher' ? 4 : 5) && (
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
                {formData.institutionType === 'teacher' ? (
                  <>
                    <div>
                      <label className="block text-gray-700 mb-2">Qualification Certificates*</label>
                      <div className="flex items-center">
                        <label className="cursor-pointer bg-orange-100 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-200 transition">
                          <input
                            type="file"
                            name="qualificationCertificates"
                            onChange={handleMultiFileChange}
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            multiple
                            required
                          />
                          Choose Files
                        </label>
                        {formData.qualificationCertificates.length > 0 && (
                          <span className="ml-3 text-gray-700">
                            {formData.qualificationCertificates.length} files selected
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Upload scanned copies of your degrees/certificates</p>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">ID Proof*</label>
                      <div className="flex items-center">
                        <label className="cursor-pointer bg-orange-100 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-200 transition">
                          <input
                            type="file"
                            name="idProof"
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                          />
                          Choose File
                        </label>
                        {formData.idProof && (
                          <span className="ml-3 text-gray-700">
                            {formData.idProof.name}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Upload Aadhar Card, PAN Card, or other government-issued ID</p>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Profile Photo*</label>
                      <div className="flex items-center">
                        <label className="cursor-pointer bg-orange-100 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-200 transition">
                          <input
                            type="file"
                            name="profileImage"
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".jpg,.jpeg,.png"
                            required
                          />
                          Choose Photo
                        </label>
                        {formData.profileImage && (
                          <span className="ml-3 text-gray-700">
                            {formData.profileImage.name}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Upload a professional photo (JPEG/PNG)</p>
                    </div>
                  </>
                ) : (
                  <>
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
                        <label className="block text-gray-700 mb-2">Affiliation Number</label>
                        <input
                          type="text"
                          name="affiliationNumber"
                          value={formData.affiliationNumber}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="e.g., CBSE/123456"
                        />
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Institution Photos</label>
                      <div className="flex items-center">
                        <label className="cursor-pointer bg-orange-100 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-200 transition">
                          <input
                            type="file"
                            name="photos"
                            onChange={handleMultiFileChange}
                            className="hidden"
                            accept=".jpg,.jpeg,.png"
                            multiple
                          />
                          Choose Photos
                        </label>
                        {formData.photos.length > 0 && (
                          <span className="ml-3 text-gray-700">
                            {formData.photos.length} photos selected
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Upload photos of your institution (JPEG/PNG)</p>
                    </div>
                    
                    
                    {/* <div>
                      <label className="block text-gray-700 mb-2">Other Documents</label>
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
                      <p className="text-sm text-gray-500 mt-1">Upload any additional relevant documents</p>
                    </div> */}
                  </>
                )}
              </div>
            </motion.div>
          )}

          <div className="mt-8 flex justify-between">
            {currentStep > 1 && (
              <motion.button
                type="button"
                onClick={prevStep}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition"
                disabled={loading}
              >
                Back
              </motion.button>
            )}
            
            {currentStep < (formData.institutionType === 'teacher' ? 4 : 5) ? (
              <motion.button
                type="button"
                onClick={nextStep}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="ml-auto bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-orange-700 transition"
                disabled={loading}
              >
                Next
              </motion.button>
            ) : (
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="ml-auto bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition"
                disabled={loading}
              >
                Submit
              </motion.button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;