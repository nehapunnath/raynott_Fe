import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSchool, FaChalkboardTeacher, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUserTie, FaBookOpen, FaCheck, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    institutionName: '',
    institutionType: '',
    establishedYear: '',
    boardAffiliation: '',
    address: '',
    city: '',
    state: '',
    pincode: '',

    // Step 2: Academic Details
    gradesOffered: [],
    mediumOfInstruction: '',
    studentStrength: '',
    teacherStrength: '',
    curriculum: '',
    facilities: [],

    // Step 3: Contact Information
    principalName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    alternatePhone: '',

    // Step 4: Documents
    registrationCertificate: null,
    affiliationCertificate: null,
    photos: [],
    otherDocuments: []
  });

  const institutionTypes = [
    'Pre-School', 'Primary School', 'Secondary School', 
    'Senior Secondary School', 'International School', 
    'Boarding School', 'Day School', 'Other'
  ];

  const boards = [
    'CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE', 
    'CIE', 'NIOS', 'Other'
  ];

  const facilities = [
    'Smart Classes', 'Library', 'Science Lab', 
    'Computer Lab', 'Playground', 'Swimming Pool',
    'Auditorium', 'Cafeteria', 'Transportation',
    'Medical Facility', 'Sports Complex', 'Music Room'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'gradesOffered' || name === 'facilities') {
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
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    navigate('/registration-success');
  };

  const StepIndicator = () => (
    <div className="flex justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center 
              ${currentStep === step ? 'bg-orange-600 text-white' : 
                currentStep > step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {currentStep > step ? <FaCheck /> : step}
          </div>
          {step < 4 && (
            <div className={`w-16 h-1 ${currentStep > step ? 'bg-green-500' : 'bg-gray-200'}`}></div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-8">
        <Header/>
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
        {/* Header */}
        
   
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-6 px-8 text-center relative">
          {/* Home Button - Top Left */}
          
          
          <h1 className="text-3xl font-bold mb-2">Register Your Institution</h1>
          <p className="text-lg">Join our network of premium educational institutions</p>
        </div>

        {/* Progress Steps */}
        <div className="px-8 pt-6">
          <StepIndicator />
        </div>

        {/* Form Sections */}
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
                <div>
                  <label className="block text-gray-700 mb-2">Institution Name*</label>
                  <input
                    type="text"
                    name="institutionName"
                    value={formData.institutionName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Institution Type*</label>
                  <select
                    name="institutionType"
                    value={formData.institutionType}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Select Type</option>
                    {institutionTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Year Established*</label>
                  <input
                    type="number"
                    name="establishedYear"
                    value={formData.establishedYear}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Board Affiliation*</label>
                  <select
                    name="boardAffiliation"
                    value={formData.boardAffiliation}
                    onChange={handleChange}
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
                  <label className="block text-gray-700 mb-2">Address*</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Grades Offered*</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {['Nursery', 'KG', '1-5', '6-8', '9-10', '11-12'].map(grade => (
                      <label key={grade} className="flex items-center">
                        <input
                          type="checkbox"
                          name="gradesOffered"
                          value={grade}
                          checked={formData.gradesOffered.includes(grade)}
                          onChange={handleChange}
                          className="mr-2 h-5 w-5 text-orange-600 rounded focus:ring-orange-500"
                        />
                        {grade}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Medium of Instruction*</label>
                  <select
                    name="mediumOfInstruction"
                    value={formData.mediumOfInstruction}
                    onChange={handleChange}
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
                
                <div>
                  <label className="block text-gray-700 mb-2">Approx. Student Strength</label>
                  <input
                    type="number"
                    name="studentStrength"
                    value={formData.studentStrength}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Approx. Teacher Strength</label>
                  <input
                    type="number"
                    name="teacherStrength"
                    value={formData.teacherStrength}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Curriculum</label>
                  <input
                    type="text"
                    name="curriculum"
                    value={formData.curriculum}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
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
              </div>
            </motion.div>
          )}

          {/* Step 3: Contact Information */}
          {currentStep === 3 && (
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
                  <label className="block text-gray-700 mb-2">Principal Name*</label>
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
              </div>
            </motion.div>
          )}

          {/* Step 4: Documents */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
                <FaUserTie className="mr-2 text-orange-600" />
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
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Affiliation Certificate*</label>
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
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">School Photos (Min 3)*</label>
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
                  <p className="text-sm text-gray-500 mt-1">Upload photos of campus, classrooms, facilities, etc.</p>
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
                  <p className="text-sm text-gray-500 mt-1">Any additional documents you'd like to share</p>
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
            
            {currentStep < 4 ? (
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
    </div>
  );
};

export default RegisterForm;