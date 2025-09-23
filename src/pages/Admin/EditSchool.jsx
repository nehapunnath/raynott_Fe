import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBookOpen, FaSearch, FaMapMarkerAlt, FaGraduationCap, FaRupeeSign, FaSchool, FaFlask, FaBook, FaRunning, FaTheaterMasks, FaChalkboardTeacher, FaVideo, FaFirstAid, FaWifi, FaLink, FaClipboardList, FaPhone } from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { schoolApi } from '../../services/schoolApi';

const EditSchool = () => {
    const { id } = useParams(); // Get school ID from URL
    const navigate = useNavigate(); // For redirecting after successful update
    const cities = ['Bangalore', 'Hyderabad', 'Mumbai', 'Kolkata', 'Delhi', 'Chennai'];

    const [formData, setFormData] = useState({
        name: '',
        typeOfSchool: '',
        affiliation: '',
        grade: '',
        ageForAdmission: '',
        language: '',
        establishmentYear: '',
        facilities: [],
        totalAnnualFee: '',
        admissionFee: '',
        tuitionFee: '',
        transportFee: '',
        booksUniformsFee: '',
        address: '',
        city: '',
        phone: '',
        email: '',
        website: '',
        socialMedia: { facebook: '', twitter: '', instagram: '' },
        googleMapsEmbedUrl: '',
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
        admissionLink: '',
        admissionProcess: '',
        schoolImage: '',
        photos: []
    });

    const [schoolImageFile, setSchoolImageFile] = useState(null);
    const [photoFiles, setPhotoFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });

    // Fetch school data when component mounts
    useEffect(() => {
        const fetchSchool = async () => {
            try {
                setIsLoading(true);
                const response = await schoolApi.getSchool(id);
                console.log('API Response:', response);
                
                if (response.success && response.data) {
                    // Firebase returns data as an object with school ID as key
                    const schoolData = response.data[id] || response.data;
                    console.log('Processed school data:', schoolData);
                    
                    // Ensure all fields are properly formatted
                    setFormData({
                        name: schoolData.name || '',
                        typeOfSchool: schoolData.typeOfSchool || '',
                        affiliation: schoolData.affiliation || '',
                        grade: schoolData.grade || '',
                        ageForAdmission: schoolData.ageForAdmission || '',
                        language: schoolData.language || '',
                        establishmentYear: schoolData.establishmentYear || '',
                        facilities: Array.isArray(schoolData.facilities) ? schoolData.facilities : [],
                        totalAnnualFee: schoolData.totalAnnualFee || '',
                        admissionFee: schoolData.admissionFee || '',
                        tuitionFee: schoolData.tuitionFee || '',
                        transportFee: schoolData.transportFee || '',
                        booksUniformsFee: schoolData.booksUniformsFee || '',
                        address: schoolData.address || '',
                        city: schoolData.city || '',
                        phone: schoolData.phone || '',
                        email: schoolData.email || '',
                        website: schoolData.website || '',
                        socialMedia: schoolData.socialMedia || { facebook: '', twitter: '', instagram: '' },
                        googleMapsEmbedUrl: schoolData.googleMapsEmbedUrl || '',
                        campusSize: schoolData.campusSize || '',
                        classrooms: schoolData.classrooms || '',
                        laboratories: schoolData.laboratories || '',
                        library: schoolData.library || '',
                        playground: schoolData.playground || '',
                        auditorium: schoolData.auditorium || '',
                        smartBoards: schoolData.smartBoards || '',
                        cctv: schoolData.cctv || '',
                        medicalRoom: schoolData.medicalRoom || '',
                        wifi: schoolData.wifi || '',
                        admissionLink: schoolData.admissionLink || '',
                        admissionProcess: schoolData.admissionProcess || '',
                        schoolImage: schoolData.schoolImage || '',
                        photos: Array.isArray(schoolData.photos) ? schoolData.photos : []
                    });
                } else {
                    setSubmitStatus({ success: false, message: response.message || 'Failed to fetch school data' });
                }
            } catch (error) {
                console.error('Error fetching school:', error);
                setSubmitStatus({ success: false, message: error.message || 'Failed to fetch school data' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchSchool();
    }, [id]);

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

    const handleRadioChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e, type) => {
        const files = Array.from(e.target.files);
        if (type === 'schoolImage') {
            if (files.length > 0) {
                setFormData(prev => ({ ...prev, schoolImage: URL.createObjectURL(files[0]) }));
                setSchoolImageFile(files[0]);
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
            photos: prev.photos.filter((_, i) => i !== index)
        }));
        setPhotoFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        // Client-side validation for required fields
        if (!formData.name || !formData.typeOfSchool || !formData.affiliation || !formData.address || !formData.city) {
            setSubmitStatus({ success: false, message: 'Please fill all required fields' });
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus({ success: null, message: '' });

        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'socialMedia' || key === 'facilities') {
                    submitData.append(key, JSON.stringify(formData[key]));
                } else if (key !== 'schoolImage' && key !== 'photos') {
                    submitData.append(key, formData[key]);
                }
            });

            if (schoolImageFile) {
                submitData.append('schoolImage', schoolImageFile);
            }

            if (photoFiles.length > 0) {
                photoFiles.forEach(file => {
                    submitData.append('photos', file);
                });
            }

            const response = await schoolApi.updateSchool(id, submitData);

            if (response.success) {
                setSubmitStatus({ success: true, message: 'School updated successfully!' });
                setTimeout(() => navigate('/admin/dashboard'), 2000); 
                setSubmitStatus({ success: false, message: response.message || 'Failed to update school' });
            }
        } catch (error) {
            console.error('Error updating school:', error);
            setSubmitStatus({ success: false, message: error.message || 'Failed to update school' });
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
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p>Error: {submitStatus.message}</p>
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Back to Schools
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
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Edit School</h1>
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
                                placeholder="School Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                required
                            />
                            <motion.select
                                name="typeOfSchool"
                                value={formData.typeOfSchool}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                required
                            >
                                <option value="">Select School Type</option>
                                <option value="Day School">Day School</option>
                                <option value="Boarding">Boarding</option>
                                <option value="Pre School">Pre School</option>
                                <option value="International School">International School</option>
                            </motion.select>
                            <motion.select
                                name="affiliation"
                                value={formData.affiliation}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                required
                            >
                                <option value="">Select Affiliation</option>
                                <option value="CBSE">CBSE</option>
                                <option value="ICSE">ICSE</option>
                                <option value="State Board">State Board</option>
                                <option value="International">International</option>
                            </motion.select>
                            <motion.input
                                type="text"
                                name="grade"
                                placeholder="Grade (e.g., Nursery to 12th)"
                                value={formData.grade}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                            <motion.input
                                type="text"
                                name="ageForAdmission"
                                placeholder="Age for Admission (e.g., 3 Years)"
                                value={formData.ageForAdmission}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                            <motion.input
                                type="text"
                                name="language"
                                placeholder="Language of Instruction"
                                value={formData.language}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                            <motion.input
                                type="number"
                                name="establishmentYear"
                                placeholder="Establishment Year"
                                value={formData.establishmentYear}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mt-6">Facilities</h3>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            {['Smart Classes', 'Swimming Pool', 'STEM Lab', 'Basketball Court', 'Music Room'].map(facility => (
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

                    {/* Fees Structure */}
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
                                name="totalAnnualFee"
                                placeholder="Total Annual Fee (e.g., ₹1,54,000/year)"
                                value={formData.totalAnnualFee}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                            <motion.input
                                type="text"
                                name="admissionFee"
                                placeholder="Admission Fee (e.g., ₹25,000)"
                                value={formData.admissionFee}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                            <motion.input
                                type="text"
                                name="tuitionFee"
                                placeholder="Tuition Fee (e.g., ₹1,00,000)"
                                value={formData.tuitionFee}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                            <motion.input
                                type="text"
                                name="transportFee"
                                placeholder="Transport Fee (e.g., ₹15,000)"
                                value={formData.transportFee}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                            <motion.input
                                type="text"
                                name="booksUniformsFee"
                                placeholder="Books & Uniforms Fee (e.g., ₹14,000)"
                                value={formData.booksUniformsFee}
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
                        transition={{ duration: 0.5, delay: 0.2 }}
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
                                placeholder="Address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                required
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
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                            <motion.input
                                type="url"
                                name="website"
                                placeholder="Website (e.g., https://www.example.com)"
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
                                name="googleMapsEmbedUrl"
                                placeholder="Google Maps Embed URL (e.g., https://www.google.com/maps/embed?...)"
                                value={formData.googleMapsEmbedUrl}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                        </div>
                    </motion.div>

                    {/* School Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                            School Image
                        </h2>
                        <motion.input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'schoolImage')}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            whileFocus={{ scale: 1.02 }}
                        />
                        {formData.schoolImage && (
                            <motion.div
                                className="relative aspect-square overflow-hidden rounded-xl mt-4 max-w-xs"
                                whileHover={{ scale: 1.02 }}
                            >
                                <img
                                    src={formData.schoolImage}
                                    alt="School Image"
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        )}
                    </motion.div>

                    {/* School Gallery */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                            School Gallery (Max 6 Images)
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

                    {/* Infrastructure */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                            School Infrastructure
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.input
                                type="text"
                                name="campusSize"
                                placeholder="Campus Size (e.g., 10 acres)"
                                value={formData.campusSize}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                            <motion.input
                                type="text"
                                name="classrooms"
                                placeholder="Classrooms (e.g., 40+)"
                                value={formData.classrooms}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                            {['laboratories', 'library', 'playground', 'auditorium', 'smartBoards', 'cctv', 'medicalRoom', 'wifi'].map(field => (
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

                    {/* Admission Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                            Admission Details
                        </h2>
                        <motion.input
                            type="url"
                            name="admissionLink"
                            placeholder="Admission Link (e.g., https://example.com/admission)"
                            value={formData.admissionLink}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            whileFocus={{ scale: 1.02 }}
                        />
                        <motion.textarea
                            name="admissionProcess"
                            placeholder="Admission Process"
                            rows="4"
                            value={formData.admissionProcess}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mt-4"
                            whileFocus={{ scale: 1.02 }}
                        />
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
                        {isSubmitting ? 'Updating...' : 'Update School Details'}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default EditSchool;