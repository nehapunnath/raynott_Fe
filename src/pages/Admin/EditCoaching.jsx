import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBookOpen, FaMapMarkerAlt, FaGraduationCap, FaRupeeSign, FaSchool, FaFlask, FaBook, FaChalkboardTeacher, FaVideo, FaFirstAid, FaWifi, FaLink, FaClipboardList, FaPhone } from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import { TuitionCoachingApi, coachingTypeApi } from '../../services/TuitionCoachingApi';

const EditCoaching = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const cities = ['Bangalore', 'Hyderabad', 'Mumbai', 'Kolkata', 'Delhi', 'Chennai'];

    const [formData, setFormData] = useState({
        name: '',
        typeOfCoaching: '',
        city: '',
        classes: '',
        subjects: '',
        batchSize: '',
        classDuration: '',
        language: '',
        establishmentYear: '',
        faculty: '',
        studyMaterial: '',
        tests: '',
        doubtSessions: '',
        infrastructure: '',
        demoClass: '',
        flexibleTimings: '',
        totalAnnualFee: '',
        admissionFee: '',
        tuitionFee: '',
        transportFee: '',
        booksUniformsFee: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        socialMedia: { facebook: '', twitter: '', instagram: '' },
        googleMapsEmbedUrl: '',
        classrooms: '',
        laboratories: '',
        library: '',
        smartBoards: '',
        cctv: '',
        medicalRoom: '',
        wifi: '',
        admissionLink: '',
        admissionProcess: '',
        centerImage: null,
        centerImagePreview: '',
        photos: [],
        photosPreview: [],
        facilities: []
    });

    const [coachingTypes, setCoachingTypes] = useState([]);
    const [newCoachingType, setNewCoachingType] = useState('');
    const [showAddType, setShowAddType] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    // Fetch coaching types and existing coaching data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsFetching(true);

                // Fetch coaching types
                const typesResponse = await coachingTypeApi.getCoachingTypes();
                if (typesResponse.success && typesResponse.data) {
                    const types = Object.values(typesResponse.data).map(type => type.name);
                    setCoachingTypes(types);
                }

                // Fetch existing coaching data
                const coachingResponse = await TuitionCoachingApi.getTuitionCoaching(id);
                if (coachingResponse.success && coachingResponse.data) {
                    const coachingData = coachingResponse.data[id] || coachingResponse.data;
                    setFormData({
                        name: coachingData.name || '',
                        typeOfCoaching: coachingData.typeOfCoaching || '',
                        city: coachingData.city || '',
                        classes: coachingData.classes || '',
                        subjects: coachingData.subjects || '',
                        batchSize: coachingData.batchSize || '',
                        classDuration: coachingData.classDuration || '',
                        language: coachingData.language || '',
                        establishmentYear: coachingData.establishmentYear || '',
                        faculty: coachingData.faculty || '',
                        studyMaterial: coachingData.studyMaterial || '',
                        tests: coachingData.tests || '',
                        doubtSessions: coachingData.doubtSessions || '',
                        infrastructure: coachingData.infrastructure || '',
                        demoClass: coachingData.demoClass || '',
                        flexibleTimings: coachingData.flexibleTimings || '',
                        totalAnnualFee: coachingData.totalAnnualFee || '',
                        admissionFee: coachingData.admissionFee || '',
                        tuitionFee: coachingData.tuitionFee || '',
                        transportFee: coachingData.transportFee || '',
                        booksUniformsFee: coachingData.booksUniformsFee || '',
                        address: coachingData.address || '',
                        phone: coachingData.phone || '',
                        email: coachingData.email || '',
                        website: coachingData.website || '',
                        socialMedia: coachingData.socialMedia || { facebook: '', twitter: '', instagram: '' },
                        googleMapsEmbedUrl: coachingData.googleMapsEmbedUrl || '',
                        classrooms: coachingData.classrooms || '',
                        laboratories: coachingData.laboratories || '',
                        library: coachingData.library || '',
                        smartBoards: coachingData.smartBoards || '',
                        cctv: coachingData.cctv || '',
                        medicalRoom: coachingData.medicalRoom || '',
                        wifi: coachingData.wifi || '',
                        admissionLink: coachingData.admissionLink || '',
                        admissionProcess: coachingData.admissionProcess || '',
                        centerImage: null,
                        centerImagePreview: coachingData.centerImage || '',
                        photos: [],
                        photosPreview: Array.isArray(coachingData.photos) ? coachingData.photos : [],
                        facilities: Array.isArray(coachingData.facilities) ? coachingData.facilities : []
                    });
                } else {
                    setMessage({
                        type: 'error',
                        text: coachingResponse.message || 'Failed to fetch coaching data'
                    });
                }
            } catch (error) {
                setMessage({
                    type: 'error',
                    text: error.response?.status === 404 ? 'Tuition/Coaching Center not found' : error.message || 'Failed to fetch data'
                });
            } finally {
                setIsFetching(false);
            }
        };
        fetchData();
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

    const handleAddCoachingType = async () => {
        if (!newCoachingType.trim()) {
            setMessage({
                type: 'error',
                text: 'Please enter a coaching type name'
            });
            return;
        }

        try {
            const response = await coachingTypeApi.addCoachingType(newCoachingType);
            if (response.success) {
                setCoachingTypes(prev => [...prev, newCoachingType]);
                setFormData(prev => ({ ...prev, typeOfCoaching: newCoachingType }));
                setNewCoachingType('');
                setShowAddType(false);
                setMessage({
                    type: 'success',
                    text: 'Coaching type added successfully'
                });
            } else {
                setMessage({
                    type: 'error',
                    text: response.message || 'Failed to add coaching type'
                });
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Failed to add coaching type: ' + (error.message || 'Unknown error')
            });
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
        if (type === 'centerImage') {
            if (files.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    centerImage: files[0],
                    centerImagePreview: URL.createObjectURL(files[0])
                }));
            }
        } else if (type === 'gallery') {
            if (formData.photos.length + files.length > 6) {
                setMessage({
                    type: 'error',
                    text: 'You can upload a maximum of 6 gallery images.'
                });
                return;
            }
            setFormData(prev => ({
                ...prev,
                photos: [...prev.photos, ...files],
                photosPreview: [...(prev.photosPreview || []), ...files.map(file => URL.createObjectURL(file))]
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        // Validate required fields
        const requiredFields = ['name', 'typeOfCoaching', 'address', 'city'];
        const errors = requiredFields.filter(field => !formData[field]);
        if (errors.length > 0) {
            setMessage({
                type: 'error',
                text: `Please fill in all required fields: ${errors.join(', ')}`
            });
            setLoading(false);
            return;
        }

        // Prepare FormData for API submission
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'socialMedia') {
                formDataToSend.append('socialMedia', JSON.stringify(formData.socialMedia));
            } else if (key === 'facilities') {
                formDataToSend.append('facilities', JSON.stringify(formData.facilities));
            } else if (key === 'centerImage' && formData.centerImage) {
                formDataToSend.append('centerImage', formData.centerImage);
            } else if (key === 'photos') {
                formData.photos.forEach((photo, index) => {
                    formDataToSend.append('photos', photo);
                });
            } else if (key !== 'centerImagePreview' && key !== 'photosPreview') {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            const response = await TuitionCoachingApi.updateTuitionCoaching(id, formDataToSend);
            if (response.success) {
                setMessage({
                    type: 'success',
                    text: 'Tuition/Coaching Center updated successfully!'
                });
                setTimeout(() => navigate('/admin/dashboard'), 2000);
            } else {
                setMessage({
                    type: 'error',
                    text: response.message || 'Failed to update tuition/coaching center'
                });
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Failed to update tuition/coaching center: ' + (error.message || 'Unknown error')
            });
        } finally {
            setLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
            {/* Message Alert */}
            {message.text && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
                        message.type === 'success' 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'
                    }`}
                >
                    {message.text}
                </motion.div>
            )}

            {/* Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-7xl mx-auto mt-8 px-4 pb-8"
            >
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Edit Tuition/Coaching Center</h1>
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
                                placeholder="Center Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                            {/* Coaching Type Dropdown with Add Option */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <select
                                        name="typeOfCoaching"
                                        value={formData.typeOfCoaching}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="">Select Coaching Type</option>
                                        {coachingTypes.map((type, index) => (
                                            <option key={index} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddType(!showAddType)}
                                        className="p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                    >
                                        {showAddType ? '−' : '+'}
                                    </button>
                                </div>
                                {showAddType && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="flex items-center space-x-2"
                                    >
                                        <input
                                            type="text"
                                            value={newCoachingType}
                                            onChange={(e) => setNewCoachingType(e.target.value)}
                                            placeholder="New coaching type"
                                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddCoachingType}
                                            className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                            disabled={loading}
                                        >
                                            Add
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                            <motion.input
                                type="text"
                                name="classes"
                                placeholder="Classes Covered (e.g., 1st to 12th)"
                                value={formData.classes}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                            <motion.input
                                type="text"
                                name="subjects"
                                placeholder="Subjects Offered (e.g., Math, Science, English)"
                                value={formData.subjects}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                            <motion.input
                                type="text"
                                name="batchSize"
                                placeholder="Batch Size (e.g., 5-8 students per batch)"
                                value={formData.batchSize}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                            <motion.input
                                type="text"
                                name="classDuration"
                                placeholder="Class Duration (e.g., 1-2 hours per session)"
                                value={formData.classDuration}
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
                            <motion.input
                                type="text"
                                name="faculty"
                                placeholder="Faculty (e.g., Experienced Teachers)"
                                value={formData.faculty}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                            <motion.input
                                type="text"
                                name="infrastructure"
                                placeholder="Infrastructure (e.g., Well-lit classrooms)"
                                value={formData.infrastructure}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mt-6">Facilities</h3>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            {['Individual Attention', 'Mock Tests', 'Online Classes', 'Study Material', 'Counseling'].map(facility => (
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
                                placeholder="Books & Materials Fee (e.g., ₹14,000)"
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
                            />
                            <motion.div 
                                className="w-full"
                                whileFocus={{ scale: 1.02 }}
                            >
                                <select
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">Select City</option>
                                    {cities.map(city => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </motion.div>
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

                    {/* Center Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                            Tuition/Coaching Center Image
                        </h2>
                        <motion.input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'centerImage')}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            whileFocus={{ scale: 1.02 }}
                        />
                        {formData.centerImagePreview && (
                            <motion.div
                                className="relative aspect-square overflow-hidden rounded-xl mt-4 max-w-xs"
                                whileHover={{ scale: 1.02 }}
                            >
                                <img
                                    src={formData.centerImagePreview}
                                    alt="Tuition/Coaching Center Image"
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Center Gallery */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                            Tuition/Coaching Center Gallery (Max 6 Images)
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
                        {formData.photosPreview && formData.photosPreview.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                {formData.photosPreview.map((photo, index) => (
                                    <motion.div
                                        key={index}
                                        className="relative aspect-square overflow-hidden rounded-xl"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <img
                                            src={photo}
                                            alt={`Gallery Photo ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
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
                            Tuition/Coaching Center Infrastructure
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.input
                                type="text"
                                name="classrooms"
                                placeholder="Classrooms (e.g., 40+)"
                                value={formData.classrooms}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                            {['laboratories', 'library', 'smartBoards', 'cctv', 'medicalRoom', 'wifi', 'studyMaterial', 'tests', 'doubtSessions', 'demoClass', 'flexibleTimings'].map(field => (
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

                    {/* Submit and Cancel Buttons */}
                    <div className="flex space-x-4">
                        <motion.button
                            onClick={handleSubmit}
                            whileHover={{ scale: 1.03, boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)' }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white py-3 rounded-lg font-bold hover:from-orange-600 hover:to-amber-700 transition-all shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Tuition/Coaching Center'}
                        </motion.button>
                        <motion.button
                            onClick={() => navigate('/admin/dashboard')}
                            whileHover={{ scale: 1.03, boxShadow: '0 4px 15px rgba(107, 114, 128, 0.3)' }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gray-500 text-white py-3 rounded-lg font-bold hover:bg-gray-600 transition-all shadow-lg"
                            disabled={loading}
                        >
                            Cancel
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default EditCoaching;