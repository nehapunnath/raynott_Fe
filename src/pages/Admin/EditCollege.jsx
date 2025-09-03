import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { collegeApi, collegeTypeApi } from '../../services/collegeApi';

const EditCollege = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // List of cities for the dropdown
    const cities = ['Bangalore', 'Hyderabad', 'Mumbai', 'Kolkata', 'Delhi', 'Chennai'];
    
    // List of facilities for checkboxes
    const facilitiesList = ['Advanced Labs', 'Digital Library', 'Hostel', 'Sports Complex', 'Cafeteria', 'WiFi Campus', 'Library', 'Auditorium', 'Medical Facility'];
    
    const [formData, setFormData] = useState({
        name: '',
        typeOfCollege: '',
        affiliation: '',
        coursesOffered: [],
        duration: '',
        language: '',
        establishmentYear: '',
        accreditation: '',
        studentTeacherRatio: '',
        transportation: '',
        placementStatistics: '',
        totalAnnualFee: '',
        admissionFee: '',
        tuitionFee: '',
        transportFee: '',
        booksUniformsFee: '',
        address: '',
        city: '',
        state: '',
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
        hostel: '',
        sports: '',
        admissionLink: '',
        admissionProcess: '',
        collegeImage: null,
        existingCollegeImage: '',
        photos: [],
        existingPhotos: [],
        facilities: []
    });

    const [collegeTypes, setCollegeTypes] = useState([]);
    const [newCollegeType, setNewCollegeType] = useState('');
    const [showAddType, setShowAddType] = useState(false);
    const [loading, setLoading] = useState(false);
    const [typeLoading, setTypeLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Fetch college data and types on component mount
    useEffect(() => {
        fetchCollegeTypes();
        fetchCollegeData();
    }, [id]);

    const fetchCollegeTypes = async () => {
        try {
            setTypeLoading(true);
            const response = await collegeTypeApi.getCollegeTypes();
            if (response.success && response.data) {
                const types = Object.values(response.data).map(type => type.name);
                setCollegeTypes(types);
            }
        } catch (error) {
            console.error('Error fetching college types:', error);
            setMessage({
                type: 'error',
                text: 'Failed to load college types'
            });
        } finally {
            setTypeLoading(false);
        }
    };

    const fetchCollegeData = async () => {
        try {
            setLoading(true);
            const response = await collegeApi.getCollege(id);
            if (response.success && response.data) {
                const college = response.data;
                
                // Convert coursesOffered from string to array if needed
                let coursesArray = [];
                if (Array.isArray(college.coursesOffered)) {
                    coursesArray = college.coursesOffered;
                } else if (typeof college.coursesOffered === 'string') {
                    coursesArray = college.coursesOffered.split(',').map(course => course.trim());
                }
                
                // Parse socialMedia if it's a string
                let socialMediaObj = { facebook: '', twitter: '', instagram: '' };
                if (typeof college.socialMedia === 'string') {
                    try {
                        socialMediaObj = JSON.parse(college.socialMedia);
                    } catch (e) {
                        console.error('Error parsing social media:', e);
                    }
                } else if (college.socialMedia && typeof college.socialMedia === 'object') {
                    socialMediaObj = college.socialMedia;
                }
                
                // Parse facilities if it's a string
                let facilitiesArray = [];
                if (typeof college.facilities === 'string') {
                    try {
                        facilitiesArray = JSON.parse(college.facilities);
                    } catch (e) {
                        console.error('Error parsing facilities:', e);
                    }
                } else if (Array.isArray(college.facilities)) {
                    facilitiesArray = college.facilities;
                }
                
                // Handle placementStatistics - extract percentage if it exists
                let placementStats = '';
                if (college.placementStatistics) {
                    if (typeof college.placementStatistics === 'object') {
                        placementStats = college.placementStatistics.percentage || '';
                    } else if (typeof college.placementStatistics === 'string') {
                        // Try to parse if it's a stringified object
                        try {
                            const parsed = JSON.parse(college.placementStatistics);
                            placementStats = parsed.percentage || '';
                        } catch (e) {
                            // If it's just a string, use it directly
                            placementStats = college.placementStatistics;
                        }
                    } else {
                        placementStats = college.placementStatistics;
                    }
                }
                
                setFormData({
                    name: college.name || '',
                    typeOfCollege: college.typeOfCollege || college.type || '',
                    affiliation: college.affiliation || '',
                    coursesOffered: coursesArray,
                    duration: college.duration || '',
                    language: college.language || '',
                    establishmentYear: college.establishmentYear || college.establishedYear || '',
                    accreditation: college.accreditation || '',
                    studentTeacherRatio: college.studentTeacherRatio || '',
                    transportation: college.transportation || '',
                    placementStatistics: placementStats,
                    totalAnnualFee: college.totalAnnualFee || '',
                    admissionFee: college.admissionFee || '',
                    tuitionFee: college.tuitionFee || '',
                    transportFee: college.transportFee || '',
                    booksUniformsFee: college.booksUniformsFee || '',
                    address: college.address || '',
                    city: college.city || '',
                    state: college.state || '',
                    phone: college.phone || '',
                    email: college.email || '',
                    website: college.website || '',
                    socialMedia: socialMediaObj,
                    googleMapsEmbedUrl: college.googleMapsEmbedUrl || '',
                    campusSize: college.campusSize || '',
                    classrooms: college.classrooms || '',
                    laboratories: college.laboratories || '',
                    library: college.library || '',
                    playground: college.playground || '',
                    auditorium: college.auditorium || '',
                    smartBoards: college.smartBoards || '',
                    cctv: college.cctv || '',
                    medicalRoom: college.medicalRoom || '',
                    wifi: college.wifi || '',
                    hostel: college.hostel || '',
                    sports: college.sports || '',
                    admissionLink: college.admissionLink || '',
                    admissionProcess: college.admissionProcess || '',
                    collegeImage: null,
                    existingCollegeImage: college.collegeImage || '',
                    photos: [],
                    existingPhotos: college.photos || [],
                    facilities: facilitiesArray
                });
            } else {
                setMessage({
                    type: 'error',
                    text: response.message || 'Failed to fetch college details'
                });
            }
        } catch (error) {
            console.error('Error fetching college:', error);
            setMessage({
                type: 'error',
                text: error.message || 'Failed to fetch college details'
            });
        } finally {
            setLoading(false);
        }
    };

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

    const handleAddCollegeType = async () => {
        if (!newCollegeType.trim()) {
            setMessage({
                type: 'error',
                text: 'Please enter a college type name'
            });
            return;
        }

        try {
            setTypeLoading(true);
            const response = await collegeTypeApi.addCollegeType(newCollegeType);
            
            if (response.success) {
                setCollegeTypes(prev => [...prev, newCollegeType]);
                setFormData(prev => ({ ...prev, typeOfCollege: newCollegeType }));
                setNewCollegeType('');
                setShowAddType(false);
                setMessage({
                    type: 'success',
                    text: 'College type added successfully'
                });
            }
        } catch (error) {
            console.error('Error adding college type:', error);
            setMessage({
                type: 'error',
                text: error.message || 'Failed to add college type'
            });
        } finally {
            setTypeLoading(false);
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

    const handleCoursesChange = (e) => {
        const courses = e.target.value.split(',').map(course => course.trim());
        setFormData(prev => ({ ...prev, coursesOffered: courses }));
    };

    const handleImageUpload = (e, type) => {
        const files = Array.from(e.target.files);
        if (type === 'collegeImage') {
            if (files.length > 0) {
                setFormData(prev => ({ 
                    ...prev, 
                    collegeImage: files[0],
                    collegeImagePreview: URL.createObjectURL(files[0]) 
                }));
            }
        } else if (type === 'gallery') {
            if (formData.photos.length + files.length > 6) {
                alert('You can upload a maximum of 6 gallery images.');
                return;
            }
            const newImages = files.map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }));
            setFormData(prev => ({ 
                ...prev, 
                photos: [...prev.photos, ...newImages] 
            }));
        }
    };

    const removeGalleryImage = (index, isExisting = false) => {
        if (isExisting) {
            // Mark existing photo for deletion on server
            setFormData(prev => ({
                ...prev,
                existingPhotos: prev.existingPhotos.filter((_, i) => i !== index)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                photos: prev.photos.filter((_, i) => i !== index)
            }));
        }
    };

    const handleSubmit = async () => {
        // Validate required fields
        const requiredFields = ['name', 'typeOfCollege', 'affiliation', 'address', 'city', 'state'];
        const missingFields = requiredFields.filter(field => !formData[field]);
        
        if (missingFields.length > 0) {
            setMessage({
                type: 'error',
                text: `Please fill in all required fields: ${missingFields.join(', ')}`
            });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Create FormData object for file upload
            const submitData = new FormData();
            
            // Append all form fields in the format expected by backend
            Object.keys(formData).forEach(key => {
                if (key === 'collegeImage' && formData[key]) {
                    submitData.append('collegeImage', formData.collegeImage);
                } else if (key === 'photos' && formData.photos.length > 0) {
                    formData.photos.forEach((photo, index) => {
                        submitData.append('photos', photo.file);
                    });
                } else if (key === 'socialMedia') {
                    submitData.append('socialMedia', JSON.stringify(formData.socialMedia));
                } else if (key === 'facilities') {
                    submitData.append('facilities', JSON.stringify(formData.facilities));
                } else if (key === 'coursesOffered') {
                    submitData.append('coursesOffered', JSON.stringify(formData.coursesOffered));
                } else if (key === 'existingPhotos') {
                    // Send info about which existing photos to keep
                    submitData.append('existingPhotos', JSON.stringify(formData.existingPhotos));
                } else if (formData[key] !== null && formData[key] !== undefined && 
                          key !== 'collegeImagePreview' && key !== 'existingCollegeImage') {
                    submitData.append(key, formData[key]);
                }
            });

            // Add placement statistics as an object
            if (formData.placementStatistics) {
                submitData.append('placementStatistics', JSON.stringify({
                    percentage: formData.placementStatistics
                }));
            }

            // Call the API to update college
            const response = await collegeApi.updateCollege(id, submitData);
            
            setMessage({
                type: 'success',
                text: response.message || 'College updated successfully!'
            });

            // Redirect after successful update
            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 2000);

        } catch (error) {
            console.error('Error updating college:', error);
            setMessage({
                type: 'error',
                text: error.message || 'Failed to update college. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading && !formData.name) {
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
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Edit College</h1>
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
                                placeholder="College Name *"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                            
                            {/* College Type Dropdown with Add Option */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <select
                                        name="typeOfCollege"
                                        value={formData.typeOfCollege}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="">Select College Type *</option>
                                        {collegeTypes.map((type, index) => (
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
                                            value={newCollegeType}
                                            onChange={(e) => setNewCollegeType(e.target.value)}
                                            placeholder="New college type"
                                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddCollegeType}
                                            disabled={typeLoading}
                                            className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors"
                                        >
                                            {typeLoading ? 'Adding...' : 'Add'}
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                            
                            <motion.input
                                type="text"
                                name="affiliation"
                                placeholder="Affiliation (e.g., VTU) *"
                                value={formData.affiliation}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                            
                            <motion.input
                                type="text"
                                name="coursesOffered"
                                placeholder="Courses Offered (comma separated, e.g., B.Tech, M.Tech, MBA)"
                                value={formData.coursesOffered.join(', ')}
                                onChange={handleCoursesChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                            
                            <motion.input
                                type="text"
                                name="duration"
                                placeholder="Duration (e.g., 4 Years for B.Tech)"
                                value={formData.duration}
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
                                name="accreditation"
                                placeholder="Accreditation (e.g., NAAC A+)"
                                value={formData.accreditation}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                            <motion.input
                                type="text"
                                name="studentTeacherRatio"
                                placeholder="Student Teacher Ratio (e.g., 15:1)"
                                value={formData.studentTeacherRatio}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                            <motion.input
                                type="text"
                                name="placementStatistics"
                                placeholder="Placement Percentage (e.g., 90%)"
                                value={formData.placementStatistics}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mt-6">Facilities</h3>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            {facilitiesList.map(facility => (
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
                                placeholder="Address *"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                            
                            {/* City Dropdown */}
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
                                    <option value="">Select City *</option>
                                    {cities.map(city => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </motion.div>
                            
                            <motion.input
                                type="text"
                                name="state"
                                placeholder="State *"
                                value={formData.state}
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

                    {/* College Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                            College Image
                        </h2>
                        {formData.existingCollegeImage && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                                <img 
                                    src={formData.existingCollegeImage} 
                                    alt="Current college" 
                                    className="w-48 h-48 object-cover rounded-lg"
                                />
                            </div>
                        )}
                        <motion.input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'collegeImage')}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            whileFocus={{ scale: 1.02 }}
                        />
                        {formData.collegeImagePreview && (
                            <motion.div
                                className="relative aspect-square overflow-hidden rounded-xl mt-4 max-w-xs"
                                whileHover={{ scale: 1.02 }}
                            >
                                <img
                                    src={formData.collegeImagePreview}
                                    alt="College Preview"
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        )}
                    </motion.div>

                    {/* College Gallery */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                            College Gallery (Max 6 Images)
                        </h2>
                        
                        {/* Existing Gallery Images */}
                        {formData.existingPhotos.length > 0 && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">Current Gallery Images:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {formData.existingPhotos.map((photo, index) => (
                                        <motion.div
                                            key={index}
                                            className="relative aspect-square overflow-hidden rounded-xl group"
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <img
                                                src={typeof photo === 'string' ? photo : photo.url}
                                                alt={`Gallery ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryImage(index, true)}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ×
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
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
                                            src={photo.preview}
                                            alt={`Gallery Preview ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryImage(index)}
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
                            College Infrastructure
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
                            {['laboratories', 'library', 'playground', 'auditorium', 'smartBoards', 'cctv', 'medicalRoom', 'wifi', 'hostel', 'sports'].map(field => (
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
                        disabled={loading}
                        whileHover={!loading ? { scale: 1.03, boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)' } : {}}
                        whileTap={!loading ? { scale: 0.98 } : {}}
                        className={`w-full py-3 rounded-lg font-bold transition-all shadow-lg mt-6 ${
                            loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'
                        }`}
                    >
                        {loading ? 'Updating...' : 'Update College Details'}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default EditCollege;