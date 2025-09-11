import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { puCollegeApi, puCollegeTypeApi } from '../../services/pucollegeApi';

const EditPucollege = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // List of cities for the dropdown
    const cities = ['Bangalore', 'Hyderabad', 'Mumbai', 'Kolkata', 'Delhi', 'Chennai'];
    
    // Updated list of facilities for checkboxes
    const facilitiesList = ['Science Labs', 'Library', 'Hostel', 'Sports Facilities', 'Cafeteria', 'WiFi', 'Auditorium', 'Medical Room'];
    
    const initialFormData = {
        name: '',
        typeOfCollege: '',
        board: '',
        streams: [],
        subjects: [],
        programDuration: '',
        language: '',
        establishmentYear: '',
        accreditation: '',
        studentTeacherRatio: '',
        competitiveExamPrep: '',
        totalAnnualFee: '',
        admissionFee: '',
        tuitionFee: '',
        transportFee: '',
        booksUniformsFee: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
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
        collegeImagePreview: null,
        photos: [],
        existingPhotos: [],
        facilities: []
    };

    const [formData, setFormData] = useState(initialFormData);
    const [puCollegeTypes, setPUCollegeTypes] = useState([]);
    const [newPUCollegeType, setNewPUCollegeType] = useState('');
    const [showAddType, setShowAddType] = useState(false);
    const [loading, setLoading] = useState(false);
    const [typeLoading, setTypeLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Cleanup for image previews
    useEffect(() => {
        return () => {
            if (formData.collegeImagePreview) {
                URL.revokeObjectURL(formData.collegeImagePreview);
            }
            formData.photos.forEach((photo) => URL.revokeObjectURL(photo.preview));
        };
    }, [formData.collegeImagePreview, formData.photos]);

    // Fetch PU college data and types on component mount
    useEffect(() => {
        fetchPUCollegeTypes();
        fetchPUCollegeData();
    }, [id]);

    const fetchPUCollegeTypes = async () => {
        try {
            setTypeLoading(true);
            const response = await puCollegeTypeApi.getPuCollegeTypes();
            if (response.success && response.data) {
                const types = Object.values(response.data).map(type => type.name);
                setPUCollegeTypes(types);
            }
        } catch (error) {
            console.error('Error fetching PU college types:', error);
            setMessage({
                type: 'error',
                text: 'Failed to load PU college types'
            });
        } finally {
            setTypeLoading(false);
        }
    };

    const fetchPUCollegeData = async () => {
        try {
            setLoading(true);
            const response = await puCollegeApi.getPUCollege(id);
            if (response.success && response.data) {
                const puCollege = response.data[id] || response.data;
                
                // Convert streams and subjects from string to array if needed
                let streamsArray = [];
                if (Array.isArray(puCollege.streams)) {
                    streamsArray = puCollege.streams;
                } else if (typeof puCollege.streams === 'string') {
                    streamsArray = puCollege.streams.split(',').map(stream => stream.trim());
                }
                
                let subjectsArray = [];
                if (Array.isArray(puCollege.subjects)) {
                    subjectsArray = puCollege.subjects;
                } else if (typeof puCollege.subjects === 'string') {
                    subjectsArray = puCollege.subjects.split(',').map(subject => subject.trim());
                }
                
                // Parse socialMedia if it's a string
                let socialMediaObj = { facebook: '', twitter: '', instagram: '' };
                if (typeof puCollege.socialMedia === 'string') {
                    try {
                        socialMediaObj = JSON.parse(puCollege.socialMedia);
                    } catch (e) {
                        console.error('Error parsing social media:', e);
                    }
                } else if (puCollege.socialMedia && typeof puCollege.socialMedia === 'object') {
                    socialMediaObj = puCollege.socialMedia;
                }
                
                // Parse facilities if it's a string
                let facilitiesArray = [];
                if (typeof puCollege.facilities === 'string') {
                    try {
                        facilitiesArray = JSON.parse(puCollege.facilities);
                    } catch (e) {
                        console.error('Error parsing facilities:', e);
                    }
                } else if (Array.isArray(puCollege.facilities)) {
                    facilitiesArray = puCollege.facilities;
                }
                
                setFormData({
                    ...initialFormData,
                    name: puCollege.name || '',
                    typeOfCollege: puCollege.typeOfCollege || '',
                    board: puCollege.board || '',
                    streams: streamsArray,
                    subjects: subjectsArray,
                    programDuration: puCollege.programDuration || '',
                    language: puCollege.language || '',
                    establishmentYear: puCollege.establishmentYear || '',
                    accreditation: puCollege.accreditation || '',
                    studentTeacherRatio: puCollege.studentTeacherRatio || '',
                    competitiveExamPrep: puCollege.competitiveExamPrep || '',
                    totalAnnualFee: puCollege.totalAnnualFee || '',
                    admissionFee: puCollege.admissionFee || '',
                    tuitionFee: puCollege.tuitionFee || '',
                    transportFee: puCollege.transportFee || '',
                    booksUniformsFee: puCollege.booksUniformsFee || '',
                    address: puCollege.address || '',
                    city: puCollege.city || '',
                    state: puCollege.state || '',
                    pincode: puCollege.pincode || '',
                    phone: puCollege.phone || '',
                    email: puCollege.email || '',
                    website: puCollege.website || '',
                    socialMedia: socialMediaObj,
                    googleMapsEmbedUrl: puCollege.googleMapsEmbedUrl || '',
                    campusSize: puCollege.campusSize || '',
                    classrooms: puCollege.classrooms || '',
                    laboratories: puCollege.laboratories || '',
                    library: puCollege.library || '',
                    playground: puCollege.playground || '',
                    auditorium: puCollege.auditorium || '',
                    smartBoards: puCollege.smartBoards || '',
                    cctv: puCollege.cctv || '',
                    medicalRoom: puCollege.medicalRoom || '',
                    wifi: puCollege.wifi || '',
                    hostel: puCollege.hostel || '',
                    sports: puCollege.sports || '',
                    admissionLink: puCollege.admissionLink || '',
                    admissionProcess: puCollege.admissionProcess || '',
                    collegeImage: null,
                    collegeImagePreview: null,
                    photos: [],
                    existingPhotos: puCollege.photos || [],
                    facilities: facilitiesArray
                });
            } else {
                setMessage({
                    type: 'error',
                    text: response.message || 'Failed to fetch PU college details'
                });
            }
        } catch (error) {
            console.error('Error fetching PU college:', error);
            setMessage({
                type: 'error',
                text: error.message || 'Failed to fetch PU college details'
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
        } else if (['totalAnnualFee', 'admissionFee', 'tuitionFee', 'transportFee', 'booksUniformsFee', 'establishmentYear'].includes(name)) {
            if (value && !/^\d+$/.test(value)) {
                setMessage({ type: 'error', text: `${name} must be a valid number` });
                return;
            }
            setFormData(prev => ({ ...prev, [name]: value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAddPUCollegeType = async () => {
        if (!newPUCollegeType.trim()) {
            setMessage({
                type: 'error',
                text: 'Please enter a PU college type name'
            });
            return;
        }

        try {
            setTypeLoading(true);
            const response = await puCollegeTypeApi.addPuCollegeType(newPUCollegeType);
            
            if (response.success) {
                setPUCollegeTypes(prev => [...prev, newPUCollegeType]);
                setFormData(prev => ({ ...prev, typeOfCollege: newPUCollegeType }));
                setNewPUCollegeType('');
                setShowAddType(false);
                setMessage({
                    type: 'success',
                    text: 'PU College type added successfully'
                });
            }
        } catch (error) {
            console.error('Error adding PU college type:', error);
            setMessage({
                type: 'error',
                text: error.message || 'Failed to add PU college type'
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

    const handleListChange = (e, field) => {
        const values = e.target.value.split(',').map(item => item.trim()).filter(item => item);
        setFormData(prev => ({ ...prev, [field]: values }));
    };

    const handleRadioChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e, type) => {
        const files = Array.from(e.target.files);
        const validTypes = ['image/jpeg', 'image/png'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (type === 'collegeImage') {
            if (files.length > 0) {
                if (!validTypes.includes(files[0].type)) {
                    setMessage({ type: 'error', text: 'Only JPEG or PNG images are allowed for college image' });
                    return;
                }
                if (files[0].size > maxSize) {
                    setMessage({ type: 'error', text: 'College image size exceeds 5MB' });
                    return;
                }
                if (formData.collegeImagePreview) {
                    URL.revokeObjectURL(formData.collegeImagePreview);
                }
                setFormData(prev => ({ 
                    ...prev, 
                    collegeImage: files[0],
                    collegeImagePreview: URL.createObjectURL(files[0]) 
                }));
            }
        } else if (type === 'gallery') {
            if (formData.photos.length + files.length + formData.existingPhotos.length > 6) {
                setMessage({ type: 'error', text: 'You can upload a maximum of 6 gallery images' });
                return;
            }
            if (files.some(file => !validTypes.includes(file.type))) {
                setMessage({ type: 'error', text: 'Only JPEG or PNG images are allowed for gallery' });
                return;
            }
            if (files.some(file => file.size > maxSize)) {
                setMessage({ type: 'error', text: 'Gallery image size exceeds 5MB' });
                return;
            }
            formData.photos.forEach(photo => URL.revokeObjectURL(photo.preview));
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
            setFormData(prev => ({
                ...prev,
                existingPhotos: prev.existingPhotos.filter((_, i) => i !== index)
            }));
        } else {
            const newPhotos = formData.photos.filter((_, i) => i !== index);
            formData.photos[index] && URL.revokeObjectURL(formData.photos[index].preview);
            setFormData(prev => ({ ...prev, photos: newPhotos }));
        }
    };

    const handleSubmit = async () => {
        // Validate required fields
        const requiredFields = ['name', 'typeOfCollege', 'board', 'address', 'city', 'state'];
        const missingFields = requiredFields.filter(field => !formData[field]);
        
        if (missingFields.length > 0) {
            setMessage({
                type: 'error',
                text: `Please fill in all required fields: ${missingFields.join(', ')}`
            });
            return;
        }

        if (!formData.collegeImage && !formData.existingCollegeImage) {
            setMessage({
                type: 'error',
                text: 'Please upload a PU college image'
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
                    formData.photos.forEach((photo) => {
                        submitData.append('photos', photo.file);
                    });
                } else if (key === 'socialMedia' || key === 'streams' || key === 'subjects' || key === 'facilities') {
                    submitData.append(key, JSON.stringify(formData[key]));
                } else if (key === 'existingPhotos') {
                    submitData.append('existingPhotos', JSON.stringify(formData.existingPhotos));
                } else if (formData[key] !== null && formData[key] !== undefined && 
                          key !== 'collegeImagePreview' && key !== 'existingCollegeImage') {
                    submitData.append(key, formData[key]);
                }
            });

            // Log FormData for debugging
            for (let [key, value] of submitData.entries()) {
                console.log(`${key}:`, value);
            }

            // Call the API to update PU college
            const response = await puCollegeApi.updatePUCollege(id, submitData);
            
            setMessage({
                type: 'success',
                text: response.message || 'PU College updated successfully!'
            });

            // Redirect after successful update
            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 2000);

        } catch (error) {
            console.error('Error updating PU college:', error.response?.data, error.message);
            setMessage({
                type: 'error',
                text: error.response?.data?.errors?.join(', ') || 
                     error.response?.data?.message || 
                     error.message || 
                     'Failed to update PU college. Please try again.'
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
                    aria-live="polite"
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
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Edit PU College</h1>
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
                                placeholder="PU College Name *"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                aria-label="PU College Name"
                            />
                            
                            {/* PU College Type Dropdown with Add Option */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <select
                                        name="typeOfCollege"
                                        value={formData.typeOfCollege}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        aria-label="PU College Type"
                                    >
                                        <option value="">Select PU College Type *</option>
                                        {puCollegeTypes.map((type, index) => (
                                            <option key={index} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddType(!showAddType)}
                                        className="p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                        aria-label={showAddType ? 'Hide add college type form' : 'Show add college type form'}
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
                                            value={newPUCollegeType}
                                            onChange={(e) => setNewPUCollegeType(e.target.value)}
                                            placeholder="New PU college type"
                                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            aria-label="New PU College Type"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddPUCollegeType}
                                            disabled={typeLoading}
                                            className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors"
                                            aria-label="Add PU College Type"
                                        >
                                            {typeLoading ? 'Adding...' : 'Add'}
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                            
                            <motion.input
                                type="text"
                                name="board"
                                placeholder="Board (e.g., Karnataka PU Board) *"
                                value={formData.board}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                aria-label="Board"
                            />
                            
                            <motion.input
                                type="text"
                                name="streams"
                                placeholder="Streams (comma separated, e.g., Science, Commerce, Arts)"
                                value={formData.streams.join(', ')}
                                onChange={(e) => handleListChange(e, 'streams')}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                aria-label="Streams"
                            />
                            
                            <motion.input
                                type="text"
                                name="subjects"
                                placeholder="Subjects (comma separated, e.g., Physics, Chemistry, Math)"
                                value={formData.subjects.join(', ')}
                                onChange={(e) => handleListChange(e, 'subjects')}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                aria-label="Subjects"
                            />
                            
                            <motion.input
                                type="text"
                                name="programDuration"
                                placeholder="Program Duration (e.g., 2 Years)"
                                value={formData.programDuration}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                aria-label="Program Duration"
                            />
                            
                            <motion.input
                                type="text"
                                name="language"
                                placeholder="Language of Instruction (e.g., English)"
                                value={formData.language}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                aria-label="Language of Instruction"
                            />
                            
                            <motion.input
                                type="number"
                                name="establishmentYear"
                                placeholder="Establishment Year (e.g., 1990)"
                                value={formData.establishmentYear}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                aria-label="Establishment Year"
                            />
                            
                            <motion.input
                                type="text"
                                name="accreditation"
                                placeholder="Accreditation (e.g., NAAC A)"
                                value={formData.accreditation}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                aria-label="Accreditation"
                            />
                            
                            <motion.input
                                type="text"
                                name="studentTeacherRatio"
                                placeholder="Student Teacher Ratio (e.g., 20:1)"
                                value={formData.studentTeacherRatio}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                aria-label="Student Teacher Ratio"
                            />
                            
                            <motion.input
                                type="text"
                                name="competitiveExamPrep"
                                placeholder="Competitive Exam Prep (e.g., JEE, NEET)"
                                value={formData.competitiveExamPrep}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                aria-label="Competitive Exam Preparation"
                            />
                            
                            <h3 className="text-lg font-semibold text-gray-700 mt-6 col-span-2">Facilities</h3>
                            <div className="grid grid-cols-2 gap-4 mt-2 col-span-2">
                                {facilitiesList.map(facility => (
                                    <label key={facility} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            name={facility}
                                            checked={formData.facilities.includes(facility)}
                                            onChange={handleCheckboxChange}
                                            className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                                            aria-label={facility}
                                        />
                                        <span>{facility}</span>
                                    </label>
                                ))}
                            </div>
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
                                placeholder="Total Annual Fee (e.g., ₹50,000)"
                                value={formData.totalAnnualFee}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                aria-label="Total Annual Fee"
                            />
                            <motion.input
                                type="text"
                                name="admissionFee"
                                placeholder="Admission Fee (e.g., ₹10,000)"
                                value={formData.admissionFee}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                aria-label="Admission Fee"
                            />
                            <motion.input
                                type="text"
                                name="tuitionFee"
                                placeholder="Tuition Fee (e.g., ₹30,000)"
                                value={formData.tuitionFee}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                aria-label="Tuition Fee"
                            />
                            <motion.input
                                type="text"
                                name="transportFee"
                                placeholder="Transport Fee (e.g., ₹5,000)"
                                value={formData.transportFee}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                aria-label="Transport Fee"
                            />
                            <motion.input
                                type="text"
                                name="booksUniformsFee"
                                placeholder="Books & Uniforms Fee (e.g., ₹5,000)"
                                value={formData.booksUniformsFee}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                aria-label="Books and Uniforms Fee"
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
                                aria-label="Address"
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
                                    aria-label="City"
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
                                aria-label="State"
                            />
                            
                            <motion.input
                                type="text"
                                name="pincode"
                                placeholder="Pincode (e.g., 560001)"
                                value={formData.pincode}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                aria-label="Pincode"
                            />
                            
                            <motion.input
                                type="tel"
                                name="phone"
                                placeholder="Phone (e.g., +91 9876543210)"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                aria-label="Phone Number"
                            />
                            
                            <motion.input
                                type="email"
                                name="email"
                                placeholder="Email (e.g., contact@example.com)"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                aria-label="Email"
                            />
                            
                            <motion.input
                                type="url"
                                name="website"
                                placeholder="Website (e.g., https://www.example.com)"
                                value={formData.website}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                aria-label="Website"
                            />
                            
                            <motion.input
                                type="url"
                                name="socialMedia.facebook"
                                placeholder="Facebook URL"
                                value={formData.socialMedia.facebook}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                aria-label="Facebook URL"
                            />
                            
                            <motion.input
                                type="url"
                                name="socialMedia.twitter"
                                placeholder="Twitter URL"
                                value={formData.socialMedia.twitter}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                aria-label="Twitter URL"
                            />
                            
                            <motion.input
                                type="url"
                                name="socialMedia.instagram"
                                placeholder="Instagram URL"
                                value={formData.socialMedia.instagram}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                aria-label="Instagram URL"
                            />
                            
                            <motion.input
                                type="url"
                                name="googleMapsEmbedUrl"
                                placeholder="Google Maps Embed URL (e.g., https://www.google.com/maps/embed?...)"
                                value={formData.googleMapsEmbedUrl}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                aria-label="Google Maps Embed URL"
                            />
                        </div>
                    </motion.div>

                    {/* PU College Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                            PU College Image *
                        </h2>
                        {formData.existingCollegeImage && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                                <img 
                                    src={formData.existingCollegeImage} 
                                    alt="Current PU college" 
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
                            aria-label="Upload PU College Image"
                        />
                        {formData.collegeImagePreview && (
                            <motion.div
                                className="relative aspect-square overflow-hidden rounded-xl mt-4 max-w-xs"
                                whileHover={{ scale: 1.02 }}
                            >
                                <img
                                    src={formData.collegeImagePreview}
                                    alt="PU College Preview"
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        )}
                    </motion.div>

                    {/* PU College Gallery */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                            PU College Gallery (Max 6 Images)
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
                                                aria-label={`Remove Gallery Image ${index + 1}`}
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
                            aria-label="Upload Gallery Images"
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
                                            aria-label={`Remove Gallery Image ${index + 1}`}
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
                            PU College Infrastructure
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.input
                                type="text"
                                name="campusSize"
                                placeholder="Campus Size (e.g., 5 acres)"
                                value={formData.campusSize}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                aria-label="Campus Size"
                            />
                            <motion.input
                                type="text"
                                name="classrooms"
                                placeholder="Classrooms (e.g., 20+)"
                                value={formData.classrooms}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                whileFocus={{ scale: 1.02 }}
                                aria-label="Classrooms"
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
                                                aria-label={`${field} Yes`}
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
                                                aria-label={`${field} No`}
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
                            aria-label="Admission Link"
                        />
                        <motion.textarea
                            name="admissionProcess"
                            placeholder="Admission Process"
                            rows="4"
                            value={formData.admissionProcess}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mt-4"
                            whileFocus={{ scale: 1.02 }}
                            aria-label="Admission Process"
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
                        aria-label="Update PU College Details"
                    >
                        {loading ? 'Updating...' : 'Update PU College Details'}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default EditPucollege;