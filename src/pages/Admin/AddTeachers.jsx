import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBookOpen, FaSearch, FaMapMarkerAlt, FaGraduationCap, FaRupeeSign, FaChalkboardTeacher, FaBook, FaClock, FaUserTie, FaVideo, FaCertificate, FaChartLine, FaSchool, FaPhone, FaEnvelope, FaGlobe, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaLanguage, FaAward } from 'react-icons/fa';

const AddTeachers = () => {
    // List of cities for the dropdown
    const cities = ['Bangalore', 'Hyderabad', 'Mumbai', 'Kolkata', 'Delhi', 'Chennai'];
    
    // List of institution types
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
        facilities: []
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('socialMedia.')) {
            const socialMediaField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                socialMedia: { ...prev.socialMedia, [socialMediaField]: value }
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
                : prev.facilities.filter(facility => facility !== name)
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, profileImage: URL.createObjectURL(file) }));
        }
    };

    const handleSubmit = () => {
        console.log('Form Data:', formData);
        alert('Teacher data submitted! Check console for details.');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
            {/* Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-7xl mx-auto mt-8 px-4 pb-8"
            >
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Add New Teacher</h1>
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
                            />
                            
                            {/* Institution Type Dropdown */}
                            <motion.select
                                name="institutionType"
                                value={formData.institutionType}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
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
                            
                            {/* City Dropdown */}
                            <motion.select
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
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
                            <motion.input
                                type="text"
                                name="progressReports"
                                placeholder="Progress Reports (e.g., Monthly)"
                                value={formData.progressReports}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                            <motion.input
                                type="text"
                                name="performanceTracking"
                                placeholder="Performance Tracking (e.g., Regular Tests)"
                                value={formData.performanceTracking}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                            />
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
                            onChange={handleImageUpload}
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

                    {/* Submit Button */}
                    <motion.button
                        onClick={handleSubmit}
                        whileHover={{ scale: 1.03, boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)' }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white py-3 rounded-lg font-bold hover:from-orange-600 hover:to-amber-700 transition-all shadow-lg"
                    >
                        Submit Teacher Details
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default AddTeachers;