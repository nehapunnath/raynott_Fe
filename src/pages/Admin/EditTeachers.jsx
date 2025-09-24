import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBookOpen, FaSearch, FaMapMarkerAlt, FaGraduationCap, FaRupeeSign, FaChalkboardTeacher, FaBook, FaClock, FaUserTie, FaVideo, FaCertificate, FaChartLine, FaSchool, FaPhone, FaEnvelope, FaGlobe, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaLanguage, FaAward } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { teacherApi } from '../../services/TeacherApi';

const EditTeachers = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const cities = ['Bangalore', 'Hyderabad', 'Mumbai', 'Kolkata', 'Delhi', 'Chennai'];
  const institutionTypes = ['School', 'College', 'PU College', 'Coaching Institute', 'Personal Mentor'];

  const [formData, setFormData] = useState({
    name: '',
    institutionType: '',
    subjects: '',
    qualification: '',
    experience: '',
    teachingMode: '',
    languages: '',
    specialization: '',
    certifications: '',
    about: '',
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
    address: '',
    city: '',
    phone: '',
    email: '',
    website: '',
    socialMedia: { facebook: '', twitter: '', instagram: '', linkedin: '' },
    googleMapsEmbedUrl: '',
    teachingProcess: '',
    profileImage: '',
    photos: [],
    facilities: [],
  });

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        setIsLoading(true);
        setSubmitStatus({ success: null, message: '' });
        const response = await teacherApi.getTeacher(id);
        console.log('API Response:', response);

        if (response.success && response.data) {
          setFormData({
            name: response.data.name || '',
            institutionType: response.data.institutionType || '',
            subjects: response.data.subjects || '',
            qualification: response.data.qualification || '',
            experience: response.data.experience || '',
            teachingMode: response.data.teachingMode || '',
            languages: response.data.languages || '',
            specialization: response.data.specialization || '',
            certifications: response.data.certifications || '',
            about: response.data.about || '',
            availability: response.data.availability || '',
            hourlyRate: response.data.hourlyRate || '',
            monthlyPackage: response.data.monthlyPackage || '',
            examPreparation: response.data.examPreparation || '',
            demoFee: response.data.demoFee || '',
            teachingApproach: response.data.teachingApproach || '',
            studyMaterials: response.data.studyMaterials || '',
            sessionDuration: response.data.sessionDuration || '',
            studentLevel: response.data.studentLevel || '',
            classSize: response.data.classSize || '',
            onlinePlatform: response.data.onlinePlatform || '',
            progressReports: response.data.progressReports || '',
            performanceTracking: response.data.performanceTracking || '',
            address: response.data.address || '',
            city: response.data.city || '',
            phone: response.data.phone || '',
            email: response.data.email || '',
            website: response.data.website || '',
            socialMedia: response.data.socialMedia || { facebook: '', twitter: '', instagram: '', linkedin: '' },
            googleMapsEmbedUrl: response.data.googleMapsEmbedUrl || '',
            teachingProcess: response.data.teachingProcess || '',
            profileImage: response.data.profileImage || '',
            photos: Array.isArray(response.data.photos) ? response.data.photos : [],
            facilities: Array.isArray(response.data.facilities) ? response.data.facilities : [],
          });
        } else {
          setSubmitStatus({ success: false, message: response.message || 'Failed to fetch teacher data' });
        }
      } catch (error) {
        console.error('Error fetching teacher:', error);
        setSubmitStatus({ success: false, message: error.message || 'Failed to fetch teacher data' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeacher();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('socialMedia.')) {
      const socialMediaField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialMedia: { ...prev.socialMedia, [socialMediaField]: value },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      facilities: checked
        ? [...prev.facilities, name]
        : prev.facilities.filter(facility => facility !== name),
    }));
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === 'profileImage') {
      if (files.length > 0) {
        setFormData(prev => ({ ...prev, profileImage: URL.createObjectURL(files[0]) }));
        setProfileImageFile(files[0]);
      }
    } else if (type === 'gallery') {
      if (formData.photos.length + files.length > 6) {
        alert('You can upload a maximum of 6 gallery images.');
        return;
      }
      const newImages = files.map(file => URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, photos: [...prev.photos, ...newImages] }));
      setPhotoFiles(prev => [...prev, ...files]);
    }
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors = [];
    const requiredFields = ['name', 'institutionType', 'subjects', 'city'];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors.push(`${field} is required`);
      }
    });
    return errors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setSubmitStatus({ success: false, message: validationErrors.join(', ') });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: '' });

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'socialMedia' || key === 'facilities' || key === 'photos') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key !== 'profileImage') {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (profileImageFile) {
        formDataToSend.append('profileImage', profileImageFile);
      }

      if (photoFiles.length > 0) {
        photoFiles.forEach(file => {
          formDataToSend.append('photos', file);
        });
      }

      // Log FormData for debugging
      for (let pair of formDataToSend.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const response = await teacherApi.updateTeacher(id, formDataToSend);
      console.log('Update response:', response);

      if (response.success) {
        setSubmitStatus({ success: true, message: 'Teacher updated successfully!' });
        setTimeout(() => navigate('/admin/dashboard'), 2000);
      } else {
        setSubmitStatus({ success: false, message: response.message || 'Failed to update teacher' });
      }
    } catch (error) {
      console.error('Error updating teacher:', error);
      setSubmitStatus({ success: false, message: error.message || 'Failed to update teacher' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (submitStatus.success === false && !formData.name) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-7xl mx-auto mt-8">
        <p>Error: {submitStatus.message}</p>
        <button
          onClick={() => navigate('/admin/teachers')}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Back to Teachers List
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-orange-50 to-white">
      {/* Status Message */}
      {submitStatus.message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {submitStatus.message}
        </motion.div>
      )}

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full px-6 py-8"
      >
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Edit Teacher</h1>
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.input
                type="text"
                name="name"
                placeholder="Teacher Name (e.g., Dr. Priya Sharma)"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
                required
              />
              <motion.select
                name="institutionType"
                value={formData.institutionType}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
                required
              >
                <option value="">Select Institution Type</option>
                {institutionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </motion.select>
              <motion.input
                type="text"
                name="subjects"
                placeholder="Subjects Taught (e.g., Mathematics, Physics, Calculus)"
                value={formData.subjects}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
                required
              />
              <motion.input
                type="text"
                name="qualification"
                placeholder="Qualifications (e.g., PhD in Mathematics, M.Ed)"
                value={formData.qualification}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="text"
                name="experience"
                placeholder="Experience (e.g., 12 years)"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="text"
                name="teachingMode"
                placeholder="Teaching Mode (e.g., Online, Offline)"
                value={formData.teachingMode}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="text"
                name="languages"
                placeholder="Languages (e.g., English, Hindi, Kannada)"
                value={formData.languages}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="text"
                name="specialization"
                placeholder="Specialization (e.g., Board Exam Preparation, IIT-JEE)"
                value={formData.specialization}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="text"
                name="certifications"
                placeholder="Certifications (e.g., CBSE Certified Teacher)"
                value={formData.certifications}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.textarea
                name="about"
                placeholder="About the Teacher"
                rows="4"
                value={formData.about}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 md:col-span-2"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="text"
                name="availability"
                placeholder="Availability (e.g., Mon-Sat: 9AM - 7PM)"
                value={formData.availability}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
                required
              >
                <option value="">Select City</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </motion.select>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mt-6">Facilities</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {['Personalized Lessons', 'Mock Tests', 'Online Classes', 'Study Material', 'Progress Tracking'].map(facility => (
                <label key={facility} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={facility}
                    checked={formData.facilities.includes(facility)}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                  />
                  <span>{facility}</span>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Fee Structure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
              Fee Structure
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.input
                type="text"
                name="hourlyRate"
                placeholder="Hourly Rate (e.g., ₹800 - ₹1200/hr)"
                value={formData.hourlyRate}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="text"
                name="monthlyPackage"
                placeholder="Monthly Package (e.g., ₹15,000 - ₹20,000)"
                value={formData.monthlyPackage}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="text"
                name="examPreparation"
                placeholder="Exam Preparation Fee (e.g., ₹25,000 for 3 months)"
                value={formData.examPreparation}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="text"
                name="demoFee"
                placeholder="Demo Class Fee (e.g., Free)"
                value={formData.demoFee}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
              />
            </div>
          </motion.div>

          {/* Teaching Methodology */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
              Teaching Methodology
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.input
                type="text"
                name="teachingApproach"
                placeholder="Teaching Approach (e.g., Conceptual & Practical)"
                value={formData.teachingApproach}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="text"
                name="studyMaterials"
                placeholder="Study Materials (e.g., Digital & Print)"
                value={formData.studyMaterials}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="text"
                name="sessionDuration"
                placeholder="Session Duration (e.g., 60-90 minutes)"
                value={formData.sessionDuration}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="text"
                name="studentLevel"
                placeholder="Student Level (e.g., Grade 6 to 12)"
                value={formData.studentLevel}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="text"
                name="classSize"
                placeholder="Class Size (e.g., 1:1 or Small Groups)"
                value={formData.classSize}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="text"
                name="onlinePlatform"
                placeholder="Online Platform (e.g., Zoom, Google Meet)"
                value={formData.onlinePlatform}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
              />
              {['progressReports', 'performanceTracking'].map(field => (
                <div key={field} className="flex items-center space-x-4">
                  <label className="text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                  <div className="flex space-x-4">
                    <label>
                      <input
                        type="radio"
                        name={field}
                        value="Yes"
                        checked={formData[field] === 'Yes'}
                        onChange={handleRadioChange}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={field}
                        value="No"
                        checked={formData[field] === 'No'}
                        onChange={handleRadioChange}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
              Contact Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.input
                type="text"
                name="address"
                placeholder="Address (e.g., HSR Layout, Bengaluru)"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="tel"
                name="phone"
                placeholder="Phone (e.g., +91 9876543210)"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="email"
                name="email"
                placeholder="Email (e.g., priya.sharma@example.com)"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="url"
                name="website"
                placeholder="Website (e.g., https://www.priyasharma.com)"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="url"
                name="socialMedia.facebook"
                placeholder="Facebook URL"
                value={formData.socialMedia.facebook}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="url"
                name="socialMedia.twitter"
                placeholder="Twitter URL"
                value={formData.socialMedia.twitter}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="url"
                name="socialMedia.instagram"
                placeholder="Instagram URL"
                value={formData.socialMedia.instagram}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="url"
                name="socialMedia.linkedin"
                placeholder="LinkedIn URL"
                value={formData.socialMedia.linkedin}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="url"
                name="googleMapsEmbedUrl"
                placeholder="Google Maps Embed URL (e.g., https://www.google.com/maps/embed?...)"
                value={formData.googleMapsEmbedUrl}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 md:col-span-2"
                whileFocus={{ scale: 1.02 }}
              />
            </div>
          </motion.div>

          {/* Teaching Process */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
              Teaching Process
            </h2>
            <motion.textarea
              name="teachingProcess"
              placeholder="Teaching Process (e.g., Sessions begin with an assessment...)"
              rows="4"
              value={formData.teachingProcess}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              whileFocus={{ scale: 1.02 }}
            />
          </motion.div>

          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
              Profile Image
            </h2>
            <motion.input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'profileImage')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              whileFocus={{ scale: 1.02 }}
            />
            {formData.profileImage && (
              <motion.div
                className="relative aspect-square overflow-hidden rounded-xl mt-4 max-w-xs"
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={formData.profileImage}
                  alt="Teacher Profile Image"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}
          </motion.div>

          {/* Teacher Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
              Teacher Gallery (Max 6 Images)
            </h2>
            <motion.input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImageUpload(e, 'gallery')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              whileFocus={{ scale: 1.02 }}
            />
            <p className="text-sm text-gray-500 mt-2">You can upload up to 6 images for the gallery.</p>
            {formData.photos.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {formData.photos.map((photo, index) => (
                  <motion.div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-xl group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <img
                      src={photo}
                      alt={`Gallery Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            onClick={handleSubmit}
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.03, boxShadow: isSubmitting ? 'none' : '0 4px 15px rgba(249, 115, 22, 0.3)' }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            className={`w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white py-3 rounded-lg font-bold transition-all shadow-lg ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-orange-600 hover:to-amber-700'
            }`}
          >
            {isSubmitting ? 'Updating...' : 'Update Teacher Details'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditTeachers;